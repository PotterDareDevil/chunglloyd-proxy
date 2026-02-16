// CLG Welcome Screen
class WelcomeScreen {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: 'Welcome to CLG Proxy! 🎉',
                description: 'The most advanced proxy with customization at your fingertips.',
                icon: 'fa-hand-wave'
            },
            {
                title: 'Stay Hidden with About:Blank 🕵️',
                description: 'Enable About:Blank in settings to open in a new tab every time, keeping your browsing private.',
                icon: 'fa-user-secret'
            },
            {
                title: 'Customize Everything 🎨',
                description: 'Change themes, backgrounds, and particles to make CLG truly yours.',
                icon: 'fa-palette'
            },
            {
                title: 'Quick Shortcuts ⌨️',
                description: 'Use Ctrl+T for settings and other keyboard shortcuts for power browsing.',
                icon: 'fa-keyboard'
            },
            {
                title: 'You\'re All Set! 🚀',
                description: 'Start browsing freely and securely. Enjoy CLG!',
                icon: 'fa-rocket'
            }
        ];
        this.init();
    }

    init() {
        const welcomed = localStorage.getItem('clgWelcomed');
        if (!welcomed) {
            setTimeout(() => {
                this.show();
            }, 2000); // Show after splash screen
        }
    }

    show() {
        const welcome = document.createElement('div');
        welcome.id = 'clg-welcome-screen';
        welcome.innerHTML = `
            <div class="welcome-overlay"></div>
            <div class="welcome-modal">
                <div class="welcome-header">
                    <div class="welcome-progress">
                        ${this.steps.map((_, i) => `<div class="progress-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
                    </div>
                </div>
                <div class="welcome-content">
                    <i class="fa-regular ${this.steps[0].icon} welcome-icon"></i>
                    <h2 class="welcome-title">${this.steps[0].title}</h2>
                    <p class="welcome-description">${this.steps[0].description}</p>
                </div>
                <div class="welcome-footer">
                    <button class="welcome-skip" id="welcome-skip">Skip Tour</button>
                    <div class="welcome-nav">
                        <button class="welcome-prev" id="welcome-prev" disabled>
                            <i class="fa-regular fa-arrow-left"></i> Back
                        </button>
                        <button class="welcome-next" id="welcome-next">
                            Next <i class="fa-regular fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcome);
        this.welcome = welcome;
        this.setupListeners();
    }

    setupListeners() {
        const nextBtn = document.getElementById('welcome-next');
        const prevBtn = document.getElementById('welcome-prev');
        const skipBtn = document.getElementById('welcome-skip');

        nextBtn.addEventListener('click', () => this.next());
        prevBtn.addEventListener('click', () => this.prev());
        skipBtn.addEventListener('click', () => this.close());
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateContent();
        } else {
            this.close();
        }
    }

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateContent();
        }
    }

    updateContent() {
        const step = this.steps[this.currentStep];
        const icon = this.welcome.querySelector('.welcome-icon');
        const title = this.welcome.querySelector('.welcome-title');
        const description = this.welcome.querySelector('.welcome-description');
        const prevBtn = document.getElementById('welcome-prev');
        const nextBtn = document.getElementById('welcome-next');
        const dots = this.welcome.querySelectorAll('.progress-dot');

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i <= this.currentStep);
        });

        // Fade out
        icon.style.opacity = '0';
        title.style.opacity = '0';
        description.style.opacity = '0';

        setTimeout(() => {
            icon.className = `fa-regular ${step.icon} welcome-icon`;
            title.textContent = step.title;
            description.textContent = step.description;

            // Fade in
            icon.style.opacity = '1';
            title.style.opacity = '1';
            description.style.opacity = '1';
        }, 200);

        // Update buttons
        prevBtn.disabled = this.currentStep === 0;
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.innerHTML = 'Get Started <i class="fa-regular fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fa-regular fa-arrow-right"></i>';
        }
    }

    close() {
        localStorage.setItem('clgWelcomed', 'true');
        this.welcome.classList.add('fade-out');
        setTimeout(() => {
            this.welcome.remove();
        }, 300);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new WelcomeScreen();
});
