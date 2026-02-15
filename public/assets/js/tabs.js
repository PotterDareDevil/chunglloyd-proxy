// CLG Tab System
class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
        this.init();
    }

    init() {
        this.createTabBar();
        this.createNewTab('https://google.com', 'New Tab');
        this.setupEventListeners();
    }

    createTabBar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const tabBar = document.createElement('div');
        tabBar.className = 'tab-bar';
        tabBar.innerHTML = `
            <div class="tabs-container" id="tabs-container"></div>
            <button class="new-tab-btn" id="new-tab-btn" title="New Tab (Ctrl+T)">
                <i class="fa-regular fa-plus"></i>
            </button>
        `;
        
        navbar.insertAdjacentElement('afterend', tabBar);
    }

    createNewTab(url = '', title = 'New Tab') {
        this.tabCounter++;
        const tabId = `tab-${this.tabCounter}`;
        
        const tab = {
            id: tabId,
            url: url,
            title: title,
            iframe: null,
            favicon: '/assets/images/icons/favicon.ico'
        };

        this.tabs.push(tab);
        this.renderTab(tab);
        this.switchToTab(tabId);
        
        return tabId;
    }

    renderTab(tab) {
        const container = document.getElementById('tabs-container');
        if (!container) return;

        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.id = tab.id;
        tabElement.innerHTML = `
            <img src="${tab.favicon}" class="tab-favicon" alt="">
            <span class="tab-title">${tab.title}</span>
            <button class="tab-close" data-tab-id="${tab.id}">
                <i class="fa-regular fa-times"></i>
            </button>
        `;

        tabElement.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.switchToTab(tab.id);
            }
        });

        const closeBtn = tabElement.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tab.id);
        });

        container.appendChild(tabElement);
    }

    switchToTab(tabId) {
        // Remove active from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Add active to selected tab
        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            tabElement.classList.add('active');
        }

        // Hide all iframes
        document.querySelectorAll('.tab-iframe').forEach(iframe => {
            iframe.style.display = 'none';
        });

        // Find and show/create iframe for this tab
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        this.activeTabId = tabId;

        if (!tab.iframe) {
            // Create new iframe for this tab
            const iframe = document.createElement('iframe');
            iframe.id = `iframe-${tabId}`;
            iframe.className = 'tab-iframe iframe';
            iframe.style.display = 'block';
            document.body.appendChild(iframe);
            tab.iframe = iframe;

            if (tab.url) {
                this.loadUrlInTab(tabId, tab.url);
            }
        } else {
            tab.iframe.style.display = 'block';
        }

        // Update navbar search with current tab URL
        this.updateNavbarUrl(tab.url);
    }

    loadUrlInTab(tabId, url) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab || !tab.iframe) return;

        tab.url = url;
        
        // Use existing proxy encoding
        if (window.getUrl) {
            window.getUrl(url).then(encodedUrl => {
                tab.iframe.src = encodedUrl;
                this.updateTabTitle(tabId, url);
            });
        } else {
            tab.iframe.src = url;
            this.updateTabTitle(tabId, url);
        }
    }

    updateTabTitle(tabId, title) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
        tab.title = shortTitle;

        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            const titleSpan = tabElement.querySelector('.tab-title');
            if (titleSpan) {
                titleSpan.textContent = shortTitle;
            }
        }
    }

    updateNavbarUrl(url) {
        const searchInput = document.getElementById('searchInputt');
        if (searchInput && window.decodeUrl) {
            searchInput.value = window.decodeUrl(url);
        }
    }

    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tab = this.tabs[tabIndex];
        
        // Remove iframe
        if (tab.iframe) {
            tab.iframe.remove();
        }

        // Remove tab element
        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            tabElement.remove();
        }

        // Remove from array
        this.tabs.splice(tabIndex, 1);

        // If closing active tab, switch to another
        if (this.activeTabId === tabId) {
            if (this.tabs.length > 0) {
                const newActiveTab = this.tabs[Math.max(0, tabIndex - 1)];
                this.switchToTab(newActiveTab.id);
            } else {
                // No tabs left, create a new one
                this.createNewTab('', 'New Tab');
            }
        }

        // If no tabs left, hide navbar
        if (this.tabs.length === 0) {
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.style.display = 'none';
        }
    }

    setupEventListeners() {
        // New tab button
        const newTabBtn = document.getElementById('new-tab-btn');
        if (newTabBtn) {
            newTabBtn.addEventListener('click', () => {
                this.createNewTab('', 'New Tab');
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+T - New Tab
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.createNewTab('', 'New Tab');
            }

            // Ctrl+W - Close Tab
            if (e.ctrlKey && e.key === 'w') {
                e.preventDefault();
                if (this.activeTabId) {
                    this.closeTab(this.activeTabId);
                }
            }

            // Ctrl+Tab - Next Tab
            if (e.ctrlKey && e.key === 'Tab') {
                e.preventDefault();
                this.switchToNextTab();
            }
        });

        // Intercept search to load in active tab
        if (window.handleSearch) {
            const originalHandleSearch = window.handleSearch;
            window.handleSearch = (query) => {
                if (this.activeTabId) {
                    const url = this.generateSearchUrl(query);
                    this.loadUrlInTab(this.activeTabId, url);
                    
                    // Show navbar if hidden
                    const navbar = document.querySelector('.navbar');
                    if (navbar) navbar.style.display = 'block';
                } else {
                    return originalHandleSearch(query);
                }
            };
        }
    }

    generateSearchUrl(query) {
        try {
            return new URL(query).toString();
        } catch {
            try {
                const u = new URL(`https://${query}`);
                if (u.hostname.includes('.')) return u.toString();
            } catch {}
        }
        if (window.getSearchEngineUrl) {
            return window.getSearchEngineUrl(query);
        }
        return `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`;
    }

    switchToNextTab() {
        if (this.tabs.length <= 1) return;
        
        const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
        const nextIndex = (currentIndex + 1) % this.tabs.length;
        this.switchToTab(this.tabs[nextIndex].id);
    }

    getActiveTab() {
        return this.tabs.find(t => t.id === this.activeTabId);
    }
}

// Initialize Tab Manager
let tabManager;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        tabManager = new TabManager();
        window.tabManager = tabManager;
    }, 500);
});
