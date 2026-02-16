// CLG Keyboard Shortcuts Overlay
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = [
            { keys: '?', description: 'Show this help menu', category: 'General' },
            { keys: 'Ctrl + T', description: 'Open settings', category: 'General' },
            { keys: 'Ctrl + K', description: 'Focus search bar', category: 'Navigation' },
            { keys: 'Ctrl + L', description: 'Clear search bar', category: 'Navigation' },
            { keys: 'Ctrl + W', description: 'Close current tab', category: 'Navigation' },
            { keys: 'Ctrl + R', description: 'Reload page', category: 'Navigation' },
            { keys: 'Escape', description: 'Panic button (exit quickly)', category: 'Safety' },
            { keys: 'Ctrl + Shift + Q', description: 'Alternative panic key', category: 'Safety' },
            { keys: 'Ctrl + B', description: 'Toggle bookmarks', category: 'Features' },
            { keys: 'Ctrl + H', description: 'View history', category: 'Features' },
            { keys: 'F11', description: 'Toggle fullscreen', category: 'View' }
        ];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                // Make sure we're not in an input field
                if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                    e.preventDefault();
                    this.toggle();
                }
            }
        });

        // Close with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    toggle() {
        const existing = document.getElementById('keyboard-shortcuts-overlay');
        if (existing) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        if (document.getElementById('keyboard-shortcuts-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'keyboard-shortcuts-overlay';
        
        // Group shortcuts by category
        const grouped = {};
        this.shortcuts.forEach(shortcut => {
            if (!grouped[shortcut.category]) {
                grouped[shortcut.category] = [];
            }
            grouped[shortcut.category].push(shortcut);
        });

        let contentHtml = '';
        for (const [category, shortcuts] of Object.entries(grouped)) {
            contentHtml += `
                <div class="shortcuts-category">
                    <h3>${category}</h3>
                    <div class="shortcuts-list">
                        ${shortcuts.map(s => `
                            <div class="shortcut-item">
                                <span class="shortcut-keys">${this.formatKeys(s.keys)}</span>
                                <span class="shortcut-description">${s.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="shortcuts-modal-overlay"></div>
            <div class="shortcuts-modal">
                <div class="shortcuts-header">
                    <h2><i class="fa-regular fa-keyboard"></i> Keyboard Shortcuts</h2>
                    <button class="shortcuts-close" id="close-shortcuts">
                        <i class="fa-regular fa-times"></i>
                    </button>
                </div>
                <div class="shortcuts-content">
                    ${contentHtml}
                </div>
                <div class="shortcuts-footer">
                    Press <kbd>?</kbd> to toggle this menu anytime
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Setup close listeners
        document.getElementById('close-shortcuts').addEventListener('click', () => this.hide());
        overlay.querySelector('.shortcuts-modal-overlay').addEventListener('click', () => this.hide());
    }

    hide() {
        const overlay = document.getElementById('keyboard-shortcuts-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    formatKeys(keys) {
        return keys.split(' + ').map(key => `<kbd>${key}</kbd>`).join(' + ');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.keyboardShortcuts = new KeyboardShortcuts();
});
