// CLG Password Gate
(function() {
    const CORRECT_PASSWORD = "clifford2026";
    const SESSION_KEY = "clg_authenticated";
    
    // Check if already authenticated this session
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        return; // Already unlocked, don't show gate
    }
    
    // Add locked class to body
    document.body.classList.add('locked');
    
    document.addEventListener('DOMContentLoaded', () => {
        const gate = document.getElementById('password-gate');
        const usernameInput = document.getElementById('gate-username');
        const passwordInput = document.getElementById('gate-password');
        const submitButton = document.getElementById('gate-submit');
        const errorDiv = document.getElementById('gate-error');
        
        function checkPassword() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username) {
                showError('Please enter a username');
                return;
            }
            
            if (!password) {
                showError('Please enter the password');
                return;
            }
            
            if (password === CORRECT_PASSWORD) {
                // Success!
                sessionStorage.setItem(SESSION_KEY, "true");
                localStorage.setItem('userName', username); // Store username for greeting
                
                gate.classList.add('unlocked');
                document.body.classList.remove('locked');
                
                setTimeout(() => {
                    gate.style.display = 'none';
                    
                    // Trigger greeting
                    const greetingEvent = new Event('load');
                    window.dispatchEvent(greetingEvent);
                    
                    // Show success toast
                    if (typeof showToast === 'function') {
                        showToast('success', `Welcome back, ${username}! 🐰`);
                    }
                }, 500);
            } else {
                showError('Incorrect password! Try again 🔒');
                passwordInput.value = '';
                passwordInput.focus();
                
                // Shake animation
                gate.querySelector('.password-container').style.animation = 'shake 0.5s';
                setTimeout(() => {
                    gate.querySelector('.password-container').style.animation = '';
                }, 500);
            }
        }
        
        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.animation = 'shake 0.3s';
            setTimeout(() => {
                errorDiv.style.animation = '';
            }, 300);
        }
        
        // Submit on button click
        submitButton.addEventListener('click', checkPassword);
        
        // Submit on Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
        
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });
        
        // Clear error on input
        usernameInput.addEventListener('input', () => errorDiv.textContent = '');
        passwordInput.addEventListener('input', () => errorDiv.textContent = '');
        
        // Auto-focus username
        setTimeout(() => usernameInput.focus(), 300);
    });
    
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
