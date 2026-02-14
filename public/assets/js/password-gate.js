// CLG Password Gate - Once per browser session
(function() {
    const CORRECT_PASSWORD = "clifford2026";
    const SESSION_KEY = "clg_authenticated";
    
    // Check if already authenticated this session
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        document.body.classList.remove('locked');
        // Hide the gate immediately if it exists
        const gate = document.getElementById('password-gate');
        if (gate) gate.style.display = 'none';
        return;
    }
    
    // Add locked class to body
    document.body.classList.add('locked');
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPasswordGate);
    } else {
        initPasswordGate();
    }
    
    function initPasswordGate() {
        const gate = document.getElementById('password-gate');
        if (!gate) return;
        
        const usernameInput = document.getElementById('gate-username');
        const passwordInput = document.getElementById('gate-password');
        const submitButton = document.getElementById('gate-submit');
        const errorDiv = document.getElementById('gate-error');
        
        function checkPassword() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username) {
                showError('Please enter a username');
                usernameInput.focus();
                return;
            }
            
            if (!password) {
                showError('Please enter the password');
                passwordInput.focus();
                return;
            }
            
            if (password === CORRECT_PASSWORD) {
                // Success!
                sessionStorage.setItem(SESSION_KEY, "true");
                localStorage.setItem('userName', username);
                
                gate.classList.add('unlocked');
                document.body.classList.remove('locked');
                
                setTimeout(() => {
                    gate.style.display = 'none';
                }, 500);
            } else {
                showError('Incorrect password! Try again 🔒');
                passwordInput.value = '';
                passwordInput.focus();
                
                // Shake animation
                const container = gate.querySelector('.password-container');
                if (container) {
                    container.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        container.style.animation = '';
                    }, 500);
                }
            }
        }
        
        function showError(message) {
            if (errorDiv) {
                errorDiv.textContent = message;
            }
        }
        
        // Submit on button click
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            checkPassword();
        });
        
        // Submit on Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkPassword();
            }
        });
        
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });
        
        // Clear error on input
        usernameInput.addEventListener('input', () => {
            if (errorDiv) errorDiv.textContent = '';
        });
        passwordInput.addEventListener('input', () => {
            if (errorDiv) errorDiv.textContent = '';
        });
        
        // Auto-focus username
        setTimeout(() => usernameInput.focus(), 300);
    }
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
})();
