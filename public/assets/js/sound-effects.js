// CLG Sound Effects System
class SoundEffects {
    constructor() {
        this.enabled = localStorage.getItem('clgSoundsEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('clgSoundsVolume') || '0.3');
        this.soundPack = localStorage.getItem('clgSoundPack') || 'futuristic';
        
        // Sound URLs (using free sound effects)
        this.sounds = {
            click: this.createTone(800, 0.05),
            hover: this.createTone(1000, 0.03),
            success: this.createTone(1200, 0.1),
            error: this.createTone(400, 0.15),
            open: this.createTone(900, 0.08),
            close: this.createTone(700, 0.08),
            whoosh: this.createTone(600, 0.12)
        };
        
        this.init();
    }

    init() {
        if (this.enabled) {
            this.attachListeners();
        }
        this.addSettingsUI();
    }

    createTone(frequency, duration) {
        // Create audio context for synthesized sounds
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = this.soundPack === 'retro' ? 'square' : 'sine';
            
            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    attachListeners() {
        // Click sounds for buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .btn, a.btn-primary, a.btn-secondary')) {
                this.play('click');
            }
        });

        // Hover sounds (subtle)
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('button, .btn')) {
                this.play('hover');
            }
        });
    }

    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    addSettingsUI() {
        const settingsHtml = `
            <div class="sound-settings-section">
                <h3><i class="fa-regular fa-volume"></i> Sound Effects</h3>
                <p class="setting-description">Customize UI sounds</p>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="sounds-toggle" ${this.enabled ? 'checked' : ''}>
                        <span>Enable Sound Effects</span>
                    </label>
                </div>

                <div class="setting-group">
                    <label>Volume</label>
                    <input type="range" id="sounds-volume" min="0" max="1" step="0.1" value="${this.volume}">
                    <span id="volume-display">${Math.round(this.volume * 100)}%</span>
                </div>

                <div class="setting-group">
                    <label>Sound Pack</label>
                    <select id="sound-pack-select">
                        <option value="futuristic" ${this.soundPack === 'futuristic' ? 'selected' : ''}>Futuristic</option>
                        <option value="minimal" ${this.soundPack === 'minimal' ? 'selected' : ''}>Minimal</option>
                        <option value="retro" ${this.soundPack === 'retro' ? 'selected' : ''}>Retro</option>
                    </select>
                </div>

                <button class="btn-primary" id="save-sound-settings">Save Sound Settings</button>
                <button class="btn-test-sound" id="test-sound">Test Sound</button>
            </div>
        `;

        setTimeout(() => {
            const settingsContent = document.querySelector('.settings-content') || 
                                   document.querySelector('.settings-panel') ||
                                   document.getElementById('settings-modal');
            
            if (settingsContent) {
                const soundDiv = document.createElement('div');
                soundDiv.innerHTML = settingsHtml;
                settingsContent.appendChild(soundDiv);
                
                // Volume slider live update
                document.getElementById('sounds-volume')?.addEventListener('input', (e) => {
                    this.volume = parseFloat(e.target.value);
                    document.getElementById('volume-display').textContent = Math.round(this.volume * 100) + '%';
                });

                // Save button
                document.getElementById('save-sound-settings')?.addEventListener('click', () => {
                    this.enabled = document.getElementById('sounds-toggle').checked;
                    this.volume = parseFloat(document.getElementById('sounds-volume').value);
                    this.soundPack = document.getElementById('sound-pack-select').value;
                    
                    localStorage.setItem('clgSoundsEnabled', this.enabled);
                    localStorage.setItem('clgSoundsVolume', this.volume);
                    localStorage.setItem('clgSoundPack', this.soundPack);
                    
                    // Recreate sounds with new pack
                    this.sounds = {
                        click: this.createTone(800, 0.05),
                        hover: this.createTone(1000, 0.03),
                        success: this.createTone(1200, 0.1),
                        error: this.createTone(400, 0.15),
                        open: this.createTone(900, 0.08),
                        close: this.createTone(700, 0.08),
                        whoosh: this.createTone(600, 0.12)
                    };
                    
                    if (this.enabled) {
                        this.attachListeners();
                    }
                    
                    this.play('success');
                });

                // Test button
                document.getElementById('test-sound')?.addEventListener('click', () => {
                    this.play('click');
                    setTimeout(() => this.play('success'), 200);
                });
            }
        }, 1000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.soundEffects = new SoundEffects();
});
