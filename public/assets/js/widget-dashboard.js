// CLG Widget Dashboard
class WidgetDashboard {
    constructor() {
        this.widgets = {
            clock: true,
            weather: false, // Will add weather API later if wanted
            quickNotes: true,
            calculator: true,
            recentSites: true,
            stats: true
        };
        this.init();
    }

    init() {
        this.loadWidgetPreferences();
        this.checkIfHomepage();
    }

    checkIfHomepage() {
    // Only show dashboard when truly on homepage
    const checkAndShow = () => {
        const iframe = document.querySelector('.iframe');
        const urlBar = document.querySelector('input[type="text"]');
        
        // Show dashboard if iframe doesn't exist, has no src, or is about:blank
        if (!iframe || !iframe.src || iframe.src === '' || iframe.src === 'about:blank' || iframe.src.includes('about:blank')) {
            // Also check if URL bar is empty
            if (!urlBar || !urlBar.value || urlBar.value === '') {
                this.showDashboard();
            } else {
                this.hideDashboard();
            }
        } else {
            this.hideDashboard();
        }
    };

    // Check on load
    setTimeout(checkAndShow, 500);

    // Monitor for changes
    const observer = new MutationObserver(checkAndShow);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });

    // Also listen for URL input changes
    setTimeout(() => {
        const urlBar = document.querySelector('input[type="text"]');
        if (urlBar) {
            urlBar.addEventListener('input', checkAndShow);
            urlBar.addEventListener('change', checkAndShow);
        }
    }, 1000);
}


    showDashboard() {
        if (document.getElementById('widget-dashboard')) return;

        const dashboard = document.createElement('div');
        dashboard.id = 'widget-dashboard';
        dashboard.innerHTML = this.buildDashboard();
        
        const container = document.querySelector('.content-area') || document.body;
        container.appendChild(dashboard);

        this.initializeWidgets();
    }

    hideDashboard() {
        const dashboard = document.getElementById('widget-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }

    buildDashboard() {
        return `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Welcome to CLG Proxy</h1>
                    <p class="dashboard-subtitle">Your private browsing gateway</p>
                </div>

                <div class="widgets-grid">
                    ${this.widgets.clock ? this.buildClockWidget() : ''}
                    ${this.widgets.quickNotes ? this.buildNotesWidget() : ''}
                    ${this.widgets.calculator ? this.buildCalculatorWidget() : ''}
                    ${this.widgets.recentSites ? this.buildRecentSitesWidget() : ''}
                    ${this.widgets.stats ? this.buildStatsWidget() : ''}
                </div>

                <div class="dashboard-footer">
                    <p>Start browsing by entering a URL in the bar above</p>
                </div>
            </div>
        `;
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
                    <button class="calc-btn" data-action="operator" data-value="-">-</button>
                    
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
        // Clock
        if (this.widgets.clock) {
            this.startClock();
        }

        // Notes
        if (this.widgets.quickNotes) {
            const notesArea = document.getElementById('quick-notes');
            if (notesArea) {
                notesArea.addEventListener('input', (e) => {
                    localStorage.setItem('clgQuickNotes', e.target.value);
                });
            }
        }

        // Calculator
        if (this.widgets.calculator) {
            this.initCalculator();
        }

        // Recent Sites
        if (this.widgets.recentSites) {
            this.initRecentSites();
        }
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
                // Trigger site load (you'll need to integrate with your existing URL loading system)
                const urlInput = document.querySelector('input[type="text"]');
                if (urlInput) {
                    urlInput.value = url;
                    urlInput.dispatchEvent(new Event('submit'));
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
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
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
        const prefs = JSON.parse(localStorage.getItem('clgWidgetPrefs') || '{}');
        this.widgets = { ...this.widgets, ...prefs };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.widgetDashboard = new WidgetDashboard();
});
