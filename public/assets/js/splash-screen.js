// CLG Splash Screen
class SplashScreen {
    constructor() {
        this.init();
    }

    init() {
        // Check if splash has been shown this session
        const splashShown = sessionStorage.getItem('clgSplashShown');
        
        if (!splashShown) {
            this.createSplash();
            sessionStorage.setItem('clgSplashShown', 'true');
        }
    }

    createSplash() {
        const splash = document.createElement('div');
        splash.id = 'clg-splash-screen';
        splash.innerHTML = `
            <div class="splash-content">
                <div class="splash-logo">
                    <img src="/assets/images/icons/clg-bunny.png" alt="CLG">
                    <h1>CLG<span class="splash-dot">.</span></h1>
                </div>
                <div class="splash-tagline">Powered by CLG</div>
            </div>
        `;
        
        document.body.appendChild(splash);
        
        // Animate out after delay
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.remove();
            }, 500);
        }, 1500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new SplashScreen();
});
