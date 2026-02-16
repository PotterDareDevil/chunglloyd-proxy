// CLG Page Load Progress Bar
class ProgressBar {
    constructor() {
        this.progress = 0;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.setupListeners();
    }

    createProgressBar() {
        const bar = document.createElement('div');
        bar.id = 'clg-progress-bar';
        bar.innerHTML = '<div class="progress-bar-fill"></div>';
        document.body.appendChild(bar);
        this.bar = bar;
        this.fill = bar.querySelector('.progress-bar-fill');
    }

    setupListeners() {
        // Monitor iframe loading
        const observer = new MutationObserver(() => {
            const iframes = document.querySelectorAll('iframe.iframe');
            iframes.forEach(iframe => {
                if (!iframe.dataset.progressListener) {
                    iframe.dataset.progressListener = 'true';
                    
                    // Start progress when iframe src changes
                    const srcObserver = new MutationObserver(() => {
                        if (iframe.src) {
                            this.start();
                        }
                    });
                    
                    srcObserver.observe(iframe, {
                        attributes: true,
                        attributeFilter: ['src']
                    });
                    
                    iframe.addEventListener('load', () => {
                        this.complete();
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    start() {
        this.progress = 0;
        this.bar.classList.add('active');
        this.updateProgress();
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 10;
                if (this.progress > 90) this.progress = 90;
                this.updateProgress();
            }
        }, 200);
    }

    complete() {
        clearInterval(this.animationInterval);
        this.progress = 100;
        this.updateProgress();
        
        setTimeout(() => {
            this.bar.classList.remove('active');
            this.progress = 0;
        }, 300);
    }

    updateProgress() {
        this.fill.style.width = this.progress + '%';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.progressBar = new ProgressBar();
});
