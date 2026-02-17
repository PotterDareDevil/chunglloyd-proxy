// CLG Performance Mode
class PerformanceMode {
    constructor() {
        this.performanceMode = localStorage.getItem('clgPerformanceMode') === 'true';
        this.autoDetect = localStorage.getItem('clgAutoDetectPerformance') !== 'false';
        this.init();
    }

    init() {
        // Auto-detect low-end devices
        if (this.autoDetect && !localStorage.getItem('clgPerformanceMode')) {
            this.detectDevice();
        }

        if (this.performanceMode) {
            this.enablePerformanceMode();
        }

        this.createToggle();
        this.addSettingsUI();
    }

    detectDevice() {
        const checks = {
            cores: navigator.hardwareConcurrency || 4,
            memory: navigator.deviceMemory || 4,
            connection: navigator.connection?.effectiveType || '4g'
        };

        // Enable performance mode if:
        // - Less than 4 CPU cores
        // - Less than 4GB RAM
        // - Slow connection (2g, slow-2g)
        const isLowEnd = checks.cores < 4 || 
                        checks.memory < 4 || 
                        ['slow-2g', '2g'].includes(checks.connection);

        if (isLowEnd) {
            this.performanceMode = true;
            localStorage.setItem('clgPerformanceMode', 'true');
            this.enablePerformanceMode();
            this.showNotification('Performance mode enabled for better experience');
        }
    }

    enablePerformanceMode() {
        document.body.classList.add('performance-mode');
        
        // Disable particles
        this.disableParticles();
        
        // Reduce animations
        this.reduceAnimations();
        
        // Disable unnecessary effects
        this.disableEffects();
        
        console.log('🚀 Performance Mode: ENABLED');
    }

    disablePerformanceMode() {
        document.body.classList.remove('performance-mode');
        
        // Re-enable particles
        this.enableParticles();
        
        console.log('🎨 Performance Mode: DISABLED');
    }

    disableParticles() {
        // Stop particle systems
        const particles = document.querySelector('.particles') || 
                         document.getElementById('particles') ||
                         document.querySelector('canvas');
        
        if (particles) {
            particles.style.display = 'none';
        }

        // Stop particle.js if it exists
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
        }

        // Stop any canvas animations
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
            }
        });
    }

    enableParticles() {
        const particles = document.querySelector('.particles') || 
                         document.getElementById('particles') ||
                         document.querySelector('canvas');
        
        if (particles) {
            particles.style.display = 'block';
        }

        // Reinitialize particles if you have an init function
        if (window.initParticles) {
            window.initParticles();
        }
    }

    reduceAnimations() {
        // Add CSS to reduce motion
        const style = document.createElement('style');
        style.id = 'performance-mode-styles';
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .performance-mode .widget:hover {
                transform: none !important;
            }
            
            .performance-mode .custom-cursor {
                display: none !important;
            }
            
            .performance-mode .clifford-mascot {
                animation: none !important;
            }
        `;
        
        if (!document.getElementById('performance-mode-styles')) {
            document.head.appendChild(style);
        }
    }

    disableEffects() {
        // Disable blur effects
        document.querySelectorAll('[style*="backdrop-filter"]').forEach(el => {
            el.style.backdropFilter = 'none';
        });

        // Disable Clifford animations
        if (window.cliffordMascot) {
            const mascot = document.getElementById('clifford-mascot');
            if (mascot) mascot.style.display = 'none';
        }
    }

    createToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'performance-mode-toggle';
        toggle.className = 'performance-toggle-btn';
        toggle.innerHTML = `
            <i class="fa-regular fa-${this.performanceMode ? 'gauge-simple' : 'gauge-simple-high'}"></i>
        `;
        toggle.title = this.performanceMode ? 'Performance Mode: ON' : 'Performance Mode: OFF';
        
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            this.performanceMode = !this.performanceMode;
            localStorage.setItem('clgPerformanceMode', this.performanceMode);
            
            if (this.performanceMode) {
                this.enablePerformanceMode();
                this.showNotification('Performance mode enabled');
            } else {
                this.disablePerformanceMode();
                this.showNotification('Performance mode disabled - Page will reload');
                setTimeout(() => window.location.reload(), 1000);
            }
            
            toggle.innerHTML = `<i class="fa-regular fa-${this.performanceMode ? 'gauge-simple' : 'gauge-simple-high'}"></i>`;
            toggle.title = this.performanceMode ? 'Performance Mode: ON' : 'Performance Mode: OFF';
        });
    }

    addSettingsUI() {
        const settingsHtml = `
            <div class="performance-settings-section">
                <h3><i class="fa-regular fa-gauge-simple"></i> Performance Mode</h3>
                <p class="setting-description">Optimize for low-end devices</p>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="performance-toggle-setting" ${this.performanceMode ? 'checked' : ''}>
                        <span>Enable Performance Mode</span>
                    </label>
                    <p class="setting-hint">Disables particles, animations, and effects for better performance</p>
                </div>

                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="auto-detect-performance" ${this.autoDetect ? 'checked' : ''}>
                        <span>Auto-Detect Low-End Devices</span>
                    </label>
                    <p class="setting-hint">Automatically enable performance mode on slower devices</p>
                </div>

                <button class="btn-primary" id="save-performance-settings">Save Performance Settings</button>
            </div>
        `;

        setTimeout(() => {
            const settingsContent = document.querySelector('.settings-content') || 
                                   document.querySelector('.settings-panel') ||
                                   document.getElementById('settings-modal');
            
            if (settingsContent) {
                const perfDiv = document.createElement('div');
                perfDiv.innerHTML = settingsHtml;
                settingsContent.appendChild(perfDiv);
                
                document.getElementById('save-performance-settings')?.addEventListener('click', () => {
                    const enabled = document.getElementById('performance-toggle-setting').checked;
                    const autoDetect = document.getElementById('auto-detect-performance').checked;
                    
                    localStorage.setItem('clgPerformanceMode', enabled);
                    localStorage.setItem('clgAutoDetectPerformance', autoDetect);
                    
                    this.showNotification('Settings saved - Reloading page...');
                    setTimeout(() => window.location.reload(), 1000);
                });
            }
        }, 1000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'performance-notification';
        notification.innerHTML = `
            <i class="fa-regular fa-gauge-simple"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMode = new PerformanceMode();
});
