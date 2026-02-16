// CLG Integrated Widget Dashboard
class WidgetDashboard {
    constructor() {
        this.widgets = this.loadWidgetPreferences();
        this.init();
    }

    init() {
        this.injectWidgets();
        this.setupWidgetToggle();
    }

    injectWidgets() {
        // Find your existing homepage content area
        const homepage = document.querySelector('.home-content') || 
                        document.querySelector('.main-content') || 
                        document.getElementById('home') ||
                        document.body;

        // Only inject if not already there
        if (document.getElementById('integrated-widgets')) return;

        // Create widgets container
        const widgetsContainer = document.createElement('div');
        widgetsContainer.id = 'integrated-widgets';
        widgetsContainer.innerHTML = `
            <div class="widgets-header">
                <h2>Quick Widgets</h2>
                <button class="customize-widgets-btn" id="customize-widgets">
                    <i class="fa-regular fa-sliders"></i> Customize
                </button>
            </div>
            <div class="widgets-grid" id="widgets-grid">
                ${this.renderActiveWidgets()}
            </div>
        `;

        // Append after search bar and quick access
        const searchBar = document.querySelector('.search-container') || 
                         document.querySelector('.url-bar') ||
                         document.querySelector('input[type="text"]')?.parentElement;
        
        if (searchBar && searchBar.parentElement) {
            searchBar.parentElement.insertBefore(widgetsContainer, searchBar.nextSibling);
        } else {
            homepage.appendChild(widgetsContainer);
        }

        this.initializeWidgets();
    }

    renderActiveWidgets() {
        let html = '';
        
        if (this.widgets.clock) html += this.buildClockWidget();
        if (this.widgets.quickNotes) html += this.buildNotesWidget();
        if (this.widgets.calculator) html += this.buildCalculatorWidget();
        if (this.widgets.recentSites) html += this.buildRecentSitesWidget();
        if (this.widgets.stats) html += this.buildStatsWidget();

        return html || '<div class="no-widgets">No widgets enabled. Click "Customize" to add some!</div>';
    }

    setupWidgetToggle() {
        setTimeout(() => {
            const customizeBtn = document.getElementById('customize-widgets');
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => this.showCustomizePanel());
            }
        }, 500);
    }

    showCustomizePanel() {
        // Create modal for customization
        const modal = document.createElement('div');
        modal.id = 'widget-customize-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Customize Widgets</h2>
                    <button class="modal-close" id="close-widget-modal">
                        <i class="fa-regular fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="widget-toggle">
                        <label>
                            <input type="checkbox" id="toggle-clock" ${this.widgets.clock ? 'checked' : ''}>
                            <span class="toggle-label">
                                <i class="fa-regular fa-clock"></i> Clock Widget
                            </span>
                        </label>
                    </div>
                    <div class="widget-toggle">
                        <label>
                            <input type="checkbox" id="toggle-notes" ${this.widgets.quickNotes ? 'checked' : ''}>
                            <span class="toggle-label">
                                <i class="fa-regular fa-note-sticky"></i> Quick Notes
                            </span>
                        </label>
                    </div>
                    <div class="widget-toggle">
                        <label>
                            <input type="checkbox" id="toggle-calc" ${this.widgets.calculator ? 'checked' : ''}>
                            <span class="toggle-label">
                                <i class="fa-regular fa-calculator"></i> Calculator
                            </span>
                        </label>
                    </div>
                    <div class="widget-toggle">
                        <label>
                            <input type="checkbox" id="toggle-recent" ${this.widgets.recentSites ? 'checked' : ''}>
                            <span class="toggle-label">
                                <i class="fa-regular fa-clock-rotate-left"></i> Recent Sites
                            </span>
                        </label>
                    </div>
                    <div class="widget-toggle">
                        <label>
                            <input type="checkbox" id="toggle-stats" ${this.widgets.stats ? 'checked' : ''}>
                            <span class="toggle-label">
                                <i class="fa-regular fa-chart-line"></i> Your Stats
                            </span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-widget-modal">Cancel</button>
                    <button class="btn-primary" id="save-widgets">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup listeners
        document.getElementById('close-widget-modal').addEventListener('click', () => modal.remove());
        document.getElementById('cancel-widget-modal').addEventListener('click', () => modal.remove());
        document.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        document.getElementById('save-widgets').addEventListener('click', () => {
            this.widgets.clock = document.getElementById('toggle-clock').checked;
            this.widgets.quickNotes = document.getElementById('toggle-notes').checked;
            this.widgets.calculator = document.getElementById('toggle-calc').checked;
            this.widgets.recentSites = document.getElementById('toggle-recent').checked;
            this.widgets.stats = document.getElementById('toggle-stats').checked;
            
            this.saveWidgetPreferences();
            modal.remove();
            
            // Refresh widgets
            const grid = document.getElementById('widgets-grid');
            if (grid) {
                grid.innerHTML = this.renderActiveWidgets();
                this.initializeWidgets();
            }
        });
    }

    buildClockWidget() {
        const now = new Date();
        return `
            <div class="widget widget-clock">
                <div class="widget-icon"><i class="fa-regular fa-clock"></i></div>
                <div class="clock-time" id="clock-time">${this.formatTime(now)}</div>
                <div class="clock-date" id="clock-date">${this.formatDate(now)}</div>
            </div>
        `;
    }

    buildNotesWidget() {
        const notes = localStorage.getItem('clgQuickNotes') || '';
        return `
            <div class="widget widget-notes">
                <div class="widget-header">
                    <i class="fa-regular fa-note-sticky"></i>
                    <h3>Quick Notes</h3>
                </div>
                <textarea 
                    id="quick-notes" 
                    placeholder="Jot down your thoughts..."
                    class="notes-textarea"
                >${notes}</textarea>
                <div class="notes-footer">Auto-saved locally</div>
            </div>
        `;
    }

    buildCalculatorWidget() {
        return `
            <div class="widget widget-calculator">
                <div class="widget-header">
                    <i class="fa-regular fa-calculator"></i>
                    <h3>Calculator</h3>
                </div>
                <div class="calc-display" id="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-btn" data-action="clear">C</button>
                    <button class="calc-btn" data-action="backspace">⌫</button>
                    <button class="calc-btn" data-action="operator" data-value="/">÷</button>
                    <button class="calc-btn" data-action="operator" data-value="*">×</button>
                    
                    <button class="calc-btn" data-action="number" data-value="7">7</button>
                    <button class="calc-btn" data-action="number" data-value="8">8</button>
                    <button class="calc-btn" data-action="number" data-value="9">9</button>
                    <button class="calc-btn" data-action="operator" data-value="-">−</button>
                    
                    <button class="calc-btn" data-action="number" data-value="4">4</button>
                    <button class="calc-btn" data-action="number" data-value="5">5</button>
                    <button class="calc-btn" data-action="number" data-value="6">6</button>
                    <button class="calc-btn" data-action="operator" data-value="+">+</button>
                    
                    <button class="calc-btn" data-action="number" data-value="1">1</button>
                    <button class="calc-btn" data-action="number" data-value="2">2</button>
                    <button class="calc-btn" data-action="number" data-value="3">3</button>
                    <button class="calc-btn calc-equals" data-action="equals">=</button>
                    
                    <button class="calc-btn calc-zero" data-action="number" data-value="0">0</button>
                    <button class="calc-btn" data-action="decimal">.</button>
                </div>
            </div>
        `;
    }

    buildRecentSitesWidget() {
        const recent = JSON.parse(localStorage.getItem('clgRecentSites') || '[]');
        return `
            <div class="widget widget-recent">
                <div class="widget-header">
                    <i class="fa-regular fa-clock-rotate-left"></i>
                    <h3>Recent Sites</h3>
                </div>
                <div class="recent-list" id="recent-list">
                    ${recent.length > 0 ? 
                        recent.slice(0, 5).map(site => `
                            <div class="recent-item" data-url="${site.url}">
                                <i class="fa-regular fa-globe"></i>
                                <span class="recent-url">${this.truncateUrl(site.url)}</span>
                                <span class="recent-time">${this.timeAgo(site.timestamp)}</span>
                            </div>
                        `).join('') : 
                        '<div class="empty-state">No recent sites yet</div>'
                    }
                </div>
            </div>
        `;
    }

    buildStatsWidget() {
        const stats = JSON.parse(localStorage.getItem('clgStats') || '{"totalVisits": 0, "totalTime": 0, "sitesVisited": 0}');
        return `
            <div class="widget widget-stats">
                <div class="widget-header">
                    <i class="fa-regular fa-chart-line"></i>
                    <h3>Your Stats</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${stats.sitesVisited || 0}</div>
                        <div class="stat-label">Sites Visited</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalVisits || 0}</div>
                        <div class="stat-label">Total Visits</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${this.formatMinutes(stats.totalTime || 0)}</div>
                        <div class="stat-label">Time Browsing</div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeWidgets() {
        if (this.widgets.clock) this.startClock();
        if (this.widgets.quickNotes) this.initNotes();
        if (this.widgets.calculator) this.initCalculator();
        if (this.widgets.recentSites) this.initRecentSites();
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeEl = document.getElementById('clock-time');
            const dateEl = document.getElementById('clock-date');
            
            if (timeEl) timeEl.textContent = this.formatTime(now);
            if (dateEl) dateEl.textContent = this.formatDate(now);
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    initNotes() {
        const notesArea = document.getElementById('quick-notes');
        if (notesArea) {
            notesArea.addEventListener('input', (e) => {
                localStorage.setItem('clgQuickNotes', e.target.value);
            });
        }
    }

    initCalculator() {
        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let shouldResetDisplay = false;

        const display = document.getElementById('calc-display');
        const buttons = document.querySelectorAll('.calc-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const value = btn.dataset.value;

                if (action === 'number') {
                    if (currentValue === '0' || shouldResetDisplay) {
                        currentValue = value;
                        shouldResetDisplay = false;
                    } else {
                        currentValue += value;
                    }
                    display.textContent = currentValue;
                }

                if (action === 'decimal') {
                    if (!currentValue.includes('.')) {
                        currentValue += '.';
                        display.textContent = currentValue;
                    }
                }

                if (action === 'operator') {
                    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
                        const result = this.calculate(parseFloat(previousValue), parseFloat(currentValue), operation);
                        currentValue = result.toString();
                        display.textContent = currentValue;
                    }
                    previousValue = currentValue;
                    operation = value;
                    shouldResetDisplay = true;
                }

                if (action === 'equals') {
                    if (previousValue !== null && operation !== null) {
                        const result = this.calculate(parseFloat(previousValue), parseFloat(currentValue), operation);
                        currentValue = result.toString();
                        display.textContent = currentValue;
                        previousValue = null;
                        operation = null;
                        shouldResetDisplay = true;
                    }
                }

                if (action === 'clear') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    display.textContent = '0';
                }

                if (action === 'backspace') {
                    currentValue = currentValue.slice(0, -1) || '0';
                    display.textContent = currentValue;
                }
            });
        });
    }

    calculate(a, b, op) {
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 0;
            default: return b;
        }
    }

    initRecentSites() {
        const items = document.querySelectorAll('.recent-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                const urlInput = document.querySelector('input[type="text"]');
                if (urlInput) {
                    urlInput.value = url;
                    const form = urlInput.closest('form');
                    if (form) form.dispatchEvent(new Event('submit'));
                }
            });
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatMinutes(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    }

    truncateUrl(url) {
        return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }

    timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    loadWidgetPreferences() {
        const defaults = {
            clock: true,
            quickNotes: true,
            calculator: true,
            recentSites: true,
            stats: true
        };
        const saved = JSON.parse(localStorage.getItem('clgWidgetPrefs') || '{}');
        return { ...defaults, ...saved };
    }

    saveWidgetPreferences() {
        localStorage.setItem('clgWidgetPrefs', JSON.stringify(this.widgets));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.widgetDashboard = new WidgetDashboard();
});
