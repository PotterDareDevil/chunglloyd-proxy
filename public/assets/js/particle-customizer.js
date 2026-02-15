// CLG Particle Customizer
class ParticleCustomizer {
    constructor() {
        this.enabled = localStorage.getItem('particlesEnabled') !== 'false';
        this.shape = localStorage.getItem('particleShape') || 'circle';
        this.density = parseInt(localStorage.getItem('particleDensity') || '3');
        this.speed = parseFloat(localStorage.getItem('particleSpeed') || '1');
        this.color = localStorage.getItem('particleColor') || 'default';
        this.init();
    }

    init() {
        this.createParticleContainer();
        this.applySettings();
    }

    createParticleContainer() {
        let container = document.getElementById('particle-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'particle-container';
            document.body.appendChild(container);
        }
    }

    applySettings() {
        const container = document.getElementById('particle-container');
        if (!container) return;

        // Clear existing particles
        container.innerHTML = '';

        if (!this.enabled) {
            return;
        }

        // Create particles based on density
        const particleCount = this.density * 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle();
            container.appendChild(particle);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'custom-particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Apply shape
        this.applyShape(particle);
        
        // Apply color
        this.applyColor(particle);
        
        // Apply animation
        const duration = (Math.random() * 10 + 10) / this.speed;
        const delay = Math.random() * 5;
        particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite`;
        
        return particle;
    }

    applyShape(particle) {
        switch(this.shape) {
            case 'circle':
                particle.style.borderRadius = '50%';
                break;
            case 'square':
                particle.style.borderRadius = '0';
                break;
            case 'star':
                particle.innerHTML = '★';
                particle.style.fontSize = '16px';
                particle.style.lineHeight = '1';
                break;
            case 'heart':
                particle.innerHTML = '♥';
                particle.style.fontSize = '16px';
                particle.style.lineHeight = '1';
                break;
            case 'sparkle':
                particle.innerHTML = '✨';
                particle.style.fontSize = '14px';
                break;
        }
    }

    applyColor(particle) {
        let color;
        switch(this.color) {
            case 'default':
                color = 'var(--clg-primary, #00D9FF)';
                break;
            case 'rainbow':
                const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
                color = colors[Math.floor(Math.random() * colors.length)];
                break;
            case 'white':
                color = '#ffffff';
                break;
            case 'purple':
                color = '#a855f7';
                break;
            case 'green':
                color = '#10b981';
                break;
            case 'red':
                color = '#ef4444';
                break;
        }
        
        if (this.shape === 'star' || this.shape === 'heart' || this.shape === 'sparkle') {
            particle.style.color = color;
        } else {
            particle.style.backgroundColor = color;
        }
        
        particle.style.boxShadow = `0 0 10px ${color}`;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('particlesEnabled', enabled);
        this.applySettings();
    }

    setShape(shape) {
        this.shape = shape;
        localStorage.setItem('particleShape', shape);
        this.applySettings();
    }

    setDensity(density) {
        this.density = parseInt(density);
        localStorage.setItem('particleDensity', density);
        this.applySettings();
    }

    setSpeed(speed) {
        this.speed = parseFloat(speed);
        localStorage.setItem('particleSpeed', speed);
        this.applySettings();
    }

    setColor(color) {
        this.color = color;
        localStorage.setItem('particleColor', color);
        this.applySettings();
    }

    getAllShapes() {
        return [
            { id: 'circle', name: 'Circles', icon: '●' },
            { id: 'square', name: 'Squares', icon: '■' },
            { id: 'star', name: 'Stars', icon: '★' },
            { id: 'heart', name: 'Hearts', icon: '♥' },
            { id: 'sparkle', name: 'Sparkles', icon: '✨' }
        ];
    }

    getAllColors() {
        return [
            { id: 'default', name: 'Theme Color' },
            { id: 'rainbow', name: 'Rainbow' },
            { id: 'white', name: 'White' },
            { id: 'purple', name: 'Purple' },
            { id: 'green', name: 'Green' },
            { id: 'red', name: 'Red' }
        ];
    }
}

// Initialize
let particleCustomizer;
document.addEventListener('DOMContentLoaded', () => {
    particleCustomizer = new ParticleCustomizer();
    window.particleCustomizer = particleCustomizer;
});
