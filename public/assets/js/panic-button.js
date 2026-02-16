// CLG Panic Button System
class PanicButton {
    constructor() {
        this.panicKey = localStorage.getItem('clgPanicKey') || 'Escape';
        this.panicUrl = localStorage.getItem('clgPanicUrl') || 'https://classroom.google.com';
        this.flashEffect = localStorage.getItem('clgPanicFlash') !== 'false';
        this.init();
    }

    init() {
        this.setupListener();
        this.addSettingsButton();
    }

    setupListener() {
        document.addEventListener('keydown', (e) => {
            // Check for panic key combinations
            if (this.panicKey === 'Escape' && e.key === 'Escape') {
                this.trigger();
            } else if (this.panicKey === 'CtrlShiftQ' && e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                this.trigger();
            } else if (this.panicKey === 'CtrlShiftX' && e.ctrlKey && e.shiftKey && e.key === 'X') {
                e.preventDefault();
                this.trigger();
            } else if (this.panicKey === 'Backquote' && e.key === '`') {
                this.trigger();
            }
        });
    }

    trigger() {
        if (this.flashEffect) {
            this.showFlash();
        }
        
        // Redirect immediately
        setTimeout(() => {
            window.location.href = this.panicUrl;
        }, this.flashEffect ? 100 : 0);
    }

    showFlash() {
        const flash = document.createElement('div');
        flash.className = 'panic-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 200);
    }

    addSettingsButton() {
        // Add panic button config to settings
        // This will be in settings panel if you have one
        const panicSettingsHtml = `
            <div class="panic-settings-section">
                <h3><i class="fa-regular fa-triangle-exclamation"></i> Panic Button</h3>
                <p class="setting-description">Quickly exit to a safe page</p>
                
                <div class="setting-group">
                    <label>Panic Key</label>
                    <select id="panic-key-select">
                        <option value="Escape" ${this.panicKey === 'Escape' ? 'selected' : ''}>Escape</option>
                        <option value="CtrlShiftQ" ${this.panicKey === 'CtrlShiftQ' ? 'selected' : ''}>Ctrl+Shift+Q</option>
                        <option value="CtrlShiftX" ${this.panicKey === 'CtrlShiftX' ? 'selected' : ''}>Ctrl+Shift+X</option>
                        <option value="Backquote" ${this.panicKey === 'Backquote' ? 'selected' : ''}>` (Backtick)</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label>Redirect URL</label>
                    <input type="text" id="panic-url-input" value="${this.panicUrl}" placeholder="https://classroom.google.com">
                </div>

                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="panic-flash-toggle" ${this.flashEffect ? 'checked' : ''}>
                        <span>Flash Effect</span>
                    </label>
                </div>

                <button class="btn-primary" id="save-panic-settings">Save Panic Settings</button>
                <button class="btn-test-panic" id="test-panic">Test Panic (Won't Redirect)</button>
            </div>
        `;

        // Try to inject into settings panel
        setTimeout(() => {
            const settingsContent = document.querySelector('.settings-content') || 
                                   document.querySelector('.settings-panel') ||
                                   document.getElementById('settings-modal');
            
            if (settingsContent) {
                const panicDiv = document.createElement('div');
                panicDiv.innerHTML = panicSettingsHtml;
                settingsContent.appendChild(panicDiv);
                
                // Setup save button
                document.getElementById('save-panic-settings')?.addEventListener('click', () => {
                    this.panicKey = document.getElementById('panic-key-select').value;
                    this.panicUrl = document.getElementById('panic-url-input').value;
                    this.flashEffect = document.getElementById('panic-flash-toggle').checked;
                    
                    localStorage.setItem('clgPanicKey', this.panicKey);
                    localStorage.setItem('clgPanicUrl', this.panicUrl);
                    localStorage.setItem('clgPanicFlash', this.flashEffect);
                    
                    this.showNotification('Panic settings saved!');
                });

                // Test button
                document.getElementById('test-panic')?.addEventListener('click', () => {
                    if (this.flashEffect) {
                        this.showFlash();
                    }
                    this.showNotification('Panic triggered! (Test mode - no redirect)');
                });
            }
        }, 1000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'panic-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.panicButton = new PanicButton();
});
