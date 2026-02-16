// CLG Quick Actions Toolbar
class QuickActions {
    constructor() {
        this.isExpanded = false;
        this.init();
    }

    init() {
        this.createToolbar();
        this.setupListeners();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'quick-actions-toolbar';
        toolbar.innerHTML = `
            <button class="quick-actions-toggle" id="qa-toggle" title="Quick Actions">
                <i class="fa-regular fa-bolt"></i>
            </button>
            <div class="quick-actions-menu" id="qa-menu">
                <button class="qa-action" id="qa-screenshot" title="Screenshot">
                    <i class="fa-regular fa-camera"></i>
                    <span>Screenshot</span>
                </button>
                <button class="qa-action" id="qa-qrcode" title="QR Code">
                    <i class="fa-regular fa-qrcode"></i>
                    <span>QR Code</span>
                </button>
                <button class="qa-action" id="qa-fullscreen" title="Fullscreen">
                    <i class="fa-regular fa-expand"></i>
                    <span>Fullscreen</span>
                </button>
                <button class="qa-action" id="qa-print" title="Print">
                    <i class="fa-regular fa-print"></i>
                    <span>Print</span>
                </button>
                <button class="qa-action" id="qa-share" title="Share">
                    <i class="fa-regular fa-share-nodes"></i>
                    <span>Share</span>
                </button>
            </div>
        `;

        document.body.appendChild(toolbar);
    }

    setupListeners() {
        const toggle = document.getElementById('qa-toggle');
        const menu = document.getElementById('qa-menu');

        toggle.addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            menu.classList.toggle('expanded', this.isExpanded);
            toggle.classList.toggle('active', this.isExpanded);
        });

        // Screenshot
        document.getElementById('qa-screenshot').addEventListener('click', () => {
            this.takeScreenshot();
            this.collapse();
        });

        // QR Code
        document.getElementById('qa-qrcode').addEventListener('click', () => {
            this.generateQRCode();
            this.collapse();
        });

        // Fullscreen
        document.getElementById('qa-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
            this.collapse();
        });

        // Print
        document.getElementById('qa-print').addEventListener('click', () => {
            this.printPage();
            this.collapse();
        });

        // Share
        document.getElementById('qa-share').addEventListener('click', () => {
            this.sharePage();
            this.collapse();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#quick-actions-toolbar')) {
                this.collapse();
            }
        });
    }

    collapse() {
        this.isExpanded = false;
        document.getElementById('qa-menu').classList.remove('expanded');
        document.getElementById('qa-toggle').classList.remove('active');
    }

    takeScreenshot() {
        const iframe = document.querySelector('.iframe');
        if (!iframe || !iframe.src) {
            this.showNotification('No page loaded to screenshot', 'error');
            return;
        }

        // Since we can't screenshot cross-origin iframes, we'll show the URL as a screenshot alternative
        this.showNotification('Screenshot feature: Due to browser security, use browser screenshot tools (Windows: Win+Shift+S, Mac: Cmd+Shift+4)', 'info');
    }

    generateQRCode() {
        const iframe = document.querySelector('.iframe');
        const url = iframe?.src || window.location.href;

        if (!url || url === 'about:blank') {
            this.showNotification('No URL to generate QR code', 'error');
            return;
        }

        // Use a QR code API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-overlay"></div>
            <div class="qr-modal-content">
                <div class="qr-header">
                    <h3>QR Code</h3>
                    <button class="qr-close"><i class="fa-regular fa-times"></i></button>
                </div>
                <div class="qr-body">
                    <img src="${qrUrl}" alt="QR Code">
                    <p class="qr-url">${url}</p>
                    <a href="${qrUrl}" download="qrcode.png" class="btn-primary">Download QR Code</a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('.qr-close').addEventListener('click', close);
        modal.querySelector('.qr-modal-overlay').addEventListener('click', close);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.showNotification('Could not enter fullscreen', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    printPage() {
        const iframe = document.querySelector('.iframe');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.print();
            } catch (e) {
                window.print();
            }
        } else {
            window.print();
        }
    }

    sharePage() {
        const iframe = document.querySelector('.iframe');
        const url = iframe?.src || window.location.href;
        const title = document.title;

        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(() => {
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('URL copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Could not copy URL', 'error');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `qa-notification qa-notification-${type}`;
        notification.innerHTML = `
            <i class="fa-regular fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
    window.quickActions = new QuickActions();
});
