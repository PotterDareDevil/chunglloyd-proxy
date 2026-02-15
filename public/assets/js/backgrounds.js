// CLG Custom Backgrounds System
class BackgroundManager {
    constructor() {
        this.currentBg = localStorage.getItem('clgBackground') || 'default';
        this.customImage = localStorage.getItem('clgCustomBg');
        this.bgOpacity = parseFloat(localStorage.getItem('clgBgOpacity') || '1');
        this.bgBlur = parseInt(localStorage.getItem('clgBgBlur') || '0');
        this.init();
    }

    init() {
        this.applyBackground();
    }

    applyBackground() {
        const body = document.body;
        
        // Remove existing background overlay if present
        let bgOverlay = document.getElementById('custom-bg-overlay');
        if (!bgOverlay) {
            bgOverlay = document.createElement('div');
            bgOverlay.id = 'custom-bg-overlay';
            body.insertBefore(bgOverlay, body.firstChild);
        }

        // Apply background based on type
        if (this.currentBg === 'custom' && this.customImage) {
            bgOverlay.style.backgroundImage = `url(${this.customImage})`;
            bgOverlay.style.backgroundSize = 'cover';
            bgOverlay.style.backgroundPosition = 'center';
            bgOverlay.style.backgroundRepeat = 'no-repeat';
        } else if (this.currentBg !== 'default') {
            const preset = this.getPreset(this.currentBg);
            bgOverlay.style.backgroundImage = preset.gradient;
            bgOverlay.style.backgroundSize = '400% 400%';
            bgOverlay.style.animation = 'gradientShift 15s ease infinite';
        } else {
            bgOverlay.style.backgroundImage = '';
        }

        bgOverlay.style.opacity = this.bgOpacity;
        bgOverlay.style.filter = `blur(${this.bgBlur}px)`;
    }

    getPreset(name) {
        const presets = {
            'sunset': {
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 100%)',
                name: 'Sunset Vibes'
            },
            'ocean': {
                gradient: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 50%, #00c9ff 100%)',
                name: 'Ocean Wave'
            },
            'forest': {
                gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 50%, #56ab2f 100%)',
                name: 'Forest Green'
            },
            'fire': {
                gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #ff8008 100%)',
                name: 'Fire Blaze'
            },
            'galaxy': {
                gradient: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
                name: 'Galaxy Dreams'
            },
            'purple': {
                gradient: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 50%, #a855f7 100%)',
                name: 'Purple Haze'
            },
            'matrix': {
                gradient: 'linear-gradient(135deg, #000000 0%, #0f9b0f 50%, #00ff00 100%)',
                name: 'Matrix Code'
            },
            'candy': {
                gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 50%, #fc00ff 100%)',
                name: 'Candy Pop'
            }
        };
        return presets[name] || presets.sunset;
    }

    setBackground(type, imageData = null) {
        this.currentBg = type;
        localStorage.setItem('clgBackground', type);
        
        if (type === 'custom' && imageData) {
            this.customImage = imageData;
            localStorage.setItem('clgCustomBg', imageData);
        }
        
        this.applyBackground();
    }

    setOpacity(value) {
        this.bgOpacity = parseFloat(value);
        localStorage.setItem('clgBgOpacity', value);
        this.applyBackground();
    }

    setBlur(value) {
        this.bgBlur = parseInt(value);
        localStorage.setItem('clgBgBlur', value);
        this.applyBackground();
    }

    reset() {
        this.currentBg = 'default';
        this.customImage = null;
        this.bgOpacity = 1;
        this.bgBlur = 0;
        localStorage.removeItem('clgBackground');
        localStorage.removeItem('clgCustomBg');
        localStorage.removeItem('clgBgOpacity');
        localStorage.removeItem('clgBgBlur');
        this.applyBackground();
    }

    getAllPresets() {
        return [
            { id: 'default', name: 'Default CLG' },
            { id: 'sunset', name: 'Sunset Vibes' },
            { id: 'ocean', name: 'Ocean Wave' },
            { id: 'forest', name: 'Forest Green' },
            { id: 'fire', name: 'Fire Blaze' },
            { id: 'galaxy', name: 'Galaxy Dreams' },
            { id: 'purple', name: 'Purple Haze' },
            { id: 'matrix', name: 'Matrix Code' },
            { id: 'candy', name: 'Candy Pop' }
        ];
    }
}

// Initialize
let backgroundManager;
document.addEventListener('DOMContentLoaded', () => {
    backgroundManager = new BackgroundManager();
    window.backgroundManager = backgroundManager;
});
