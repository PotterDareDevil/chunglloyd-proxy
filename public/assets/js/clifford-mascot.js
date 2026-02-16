// CLG Animated Clifford Mascot
class CliffordMascot {
    constructor() {
        this.isVisible = localStorage.getItem('cliffordMascot') !== 'false';
        if (this.isVisible) {
            this.init();
        }
    }

    init() {
        this.createMascot();
        this.setupAnimations();
        this.setupListeners();
    }

    createMascot() {
        const mascot = document.createElement('div');
        mascot.id = 'clifford-mascot';
        mascot.innerHTML = `
            <div class="clifford-container">
                <img src="/assets/images/clifford-icon.png" alt="Clifford" class="clifford-img">
                <div class="clifford-speech-bubble"></div>
            </div>
        `;
        
        document.body.appendChild(mascot);
        this.mascot = mascot;
        this.img = mascot.querySelector('.clifford-img');
        this.bubble = mascot.querySelector('.clifford-speech-bubble');
    }

    setupAnimations() {
        // Random idle animations
        setInterval(() => {
            const animations = ['bounce', 'wiggle', 'spin'];
            const random = animations[Math.floor(Math.random() * animations.length)];
            this.animate(random);
        }, 15000);

        // Welcome message
        setTimeout(() => {
            this.say('Hey there! 👋');
        }, 3000);
    }

    setupListeners() {
        // Click Clifford for random messages
        this.img.addEventListener('click', () => {
            const messages = [
                'Woof! 🐕',
                'Need help? Check settings!',
                'You\'re awesome! ⭐',
                'Keep browsing! 🚀',
                'Having fun? 😊',
                'CLG is the best! 🎉'
            ];
            const random = messages[Math.floor(Math.random() * messages.length)];
            this.say(random);
            this.animate('jump');
        });

        // Celebrate on theme change
        document.addEventListener('themeChanged', () => {
            this.say('Nice theme! 🎨');
            this.animate('spin');
        });

        // Wave when settings open
        const settingsIcon = document.getElementById('settings-icon');
        if (settingsIcon) {
            settingsIcon.addEventListener('click', () => {
                this.animate('wave');
            });
        }
    }

    animate(type) {
        this.img.classList.add(`clifford-${type}`);
        setTimeout(() => {
            this.img.classList.remove(`clifford-${type}`);
        }, 1000);
    }

    say(message) {
        this.bubble.textContent = message;
        this.bubble.classList.add('show');
        
        setTimeout(() => {
            this.bubble.classList.remove('show');
        }, 3000);
    }

    hide() {
        this.mascot.style.display = 'none';
        localStorage.setItem('cliffordMascot', 'false');
    }

    show() {
        this.mascot.style.display = 'block';
        localStorage.setItem('cliffordMascot', 'true');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.cliffordMascot = new CliffordMascot();
});
