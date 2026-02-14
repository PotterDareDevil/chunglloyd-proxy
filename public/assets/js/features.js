// CLG Advanced Features - Themes, Bookmarks, History

// ============ THEME SYSTEM ============
const themes = {
    teal: {
        primary: '#00D9FF',
        primaryLight: '#00eeff',
        primaryDark: '#00c4e6',
        shadow: 'rgba(0, 217, 255, 0.5)'
    },
    purple: {
        primary: '#a855f7',
        primaryLight: '#c084fc',
        primaryDark: '#9333ea',
        shadow: 'rgba(168, 85, 247, 0.5)'
    },
    red: {
        primary: '#ef4444',
        primaryLight: '#f87171',
        primaryDark: '#dc2626',
        shadow: 'rgba(239, 68, 68, 0.5)'
    },
    green: {
        primary: '#10b981',
        primaryLight: '#34d399',
        primaryDark: '#059669',
        shadow: 'rgba(16, 185, 129, 0.5)'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.teal;
    const root = document.documentElement;
    
    root.style.setProperty('--clg-primary', theme.primary);
    root.style.setProperty('--clg-primary-light', theme.primaryLight);
    root.style.setProperty('--clg-primary-dark', theme.primaryDark);
    root.style.setProperty('--clg-shadow', theme.shadow);
    
    // Update all elements with theme colors
    document.body.setAttribute('data-theme', themeName);
}

// Apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('clgTheme') || 'teal';
    applyTheme(savedTheme);
});

// ============ PARTICLES TOGGLE ============
function toggleParticles(enabled) {
    const particlesElement = document.querySelector('body::after');
    document.body.style.setProperty('--particles-opacity', enabled ? '1' : '0');
}

// ============ BOOKMARKS SYSTEM ============
class BookmarksManager {
    constructor() {
        this.bookmarks = this.loadBookmarks();
    }
    
    loadBookmarks() {
        const saved = localStorage.getItem('clgBookmarks');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveBookmarks() {
        localStorage.setItem('clgBookmarks', JSON.stringify(this.bookmarks));
    }
    
    addBookmark(name, url) {
        const bookmark = {
            id: Date.now(),
            name: name,
            url: url,
            timestamp: new Date().toISOString()
        };
        this.bookmarks.unshift(bookmark);
        this.saveBookmarks();
        return bookmark;
    }
    
    removeBookmark(id) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== id);
        this.saveBookmarks();
    }
    
    getBookmarks() {
        return this.bookmarks;
    }
    
    isBookmarked(url) {
        return this.bookmarks.some(b => b.url === url);
    }
}

const bookmarksManager = new BookmarksManager();

function showBookmarksModal() {
    const existingModal = document.getElementById('bookmarks-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'bookmarks-modal';
    modal.className = 'feature-modal';
    
    const bookmarks = bookmarksManager.getBookmarks();
    
    let bookmarksHTML = '';
    if (bookmarks.length === 0) {
        bookmarksHTML = '<div class="empty-state"><i class="fa-regular fa-bookmark"></i><p>No bookmarks yet</p></div>';
    } else {
        bookmarksHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item" data-id="${bookmark.id}">
                <div class="bookmark-info">
                    <i class="fa-regular fa-bookmark"></i>
                    <div>
                        <div class="bookmark-name">${escapeHtml(bookmark.name)}</div>
                        <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
                    </div>
                </div>
                <div class="bookmark-actions">
                    <button class="bookmark-open" data-url="${escapeHtml(bookmark.url)}">
                        <i class="fa-regular fa-arrow-up-right-from-square"></i>
                    </button>
                    <button class="bookmark-delete" data-id="${bookmark.id}">
                        <i class="fa-regular fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fa-regular fa-bookmark"></i> Bookmarks</h2>
                <button class="modal-close" id="close-bookmarks">
                    <i class="fa-regular fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="add-bookmark-form">
                    <input type="text" id="bookmark-name" placeholder="Bookmark name" autocomplete="off">
                    <input type="text" id="bookmark-url" placeholder="URL" autocomplete="off">
                    <button id="add-bookmark-btn">
                        <i class="fa-regular fa-plus"></i> Add
                    </button>
                </div>
                <div class="bookmarks-list">
                    ${bookmarksHTML}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal
    document.getElementById('close-bookmarks').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    // Add bookmark
    document.getElementById('add-bookmark-btn').addEventListener('click', () => {
        const name = document.getElementById('bookmark-name').value.trim();
        const url = document.getElementById('bookmark-url').value.trim();
        
        if (!name || !url) {
            if (window.showToast) window.showToast('error', 'Please enter both name and URL');
            return;
        }
        
        bookmarksManager.addBookmark(name, url);
        if (window.showToast) window.showToast('success', 'Bookmark added!');
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        showBookmarksModal(); // Refresh
    });
    
    // Open bookmark
    modal.querySelectorAll('.bookmark-open').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            if (window.handleSearch) {
                window.handleSearch(url);
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
    });
    
    // Delete bookmark
    modal.querySelectorAll('.bookmark-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Delete this bookmark?')) {
                bookmarksManager.removeBookmark(id);
                if (window.showToast) window.showToast('success', 'Bookmark deleted');
                showBookmarksModal(); // Refresh
            }
        });
    });
}

// ============ HISTORY SYSTEM ============
class HistoryManager {
    constructor() {
        this.history = this.loadHistory();
        this.maxEntries = 100;
    }
    
    loadHistory() {
        const saved = localStorage.getItem('proxyHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveHistory() {
        localStorage.setItem('proxyHistory', JSON.stringify(this.history));
    }
    
    addEntry(url, title = '') {
        const historyEnabled = localStorage.getItem('historyEnabled') !== 'false';
        if (!historyEnabled) return;
        
        // Don't add duplicates
        this.history = this.history.filter(h => h.url !== url);
        
        const entry = {
            id: Date.now(),
            url: url,
            title: title || url,
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(entry);
        
        // Keep only recent entries
        if (this.history.length > this.maxEntries) {
            this.history = this.history.slice(0, this.maxEntries);
        }
        
        this.saveHistory();
    }
    
    getHistory() {
        return this.history;
    }
    
    clearHistory() {
        this.history = [];
        this.saveHistory();
    }
}

const historyManager = new HistoryManager();

function showHistoryModal() {
    const existingModal = document.getElementById('history-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'history-modal';
    modal.className = 'feature-modal';
    
    const history = historyManager.getHistory();
    
    let historyHTML = '';
    if (history.length === 0) {
        historyHTML = '<div class="empty-state"><i class="fa-regular fa-clock"></i><p>No history yet</p></div>';
    } else {
        historyHTML = history.map(entry => {
            const date = new Date(entry.timestamp);
            const timeAgo = getTimeAgo(date);
            
            return `
                <div class="history-item" data-id="${entry.id}">
                    <div class="history-info">
                        <i class="fa-regular fa-clock"></i>
                        <div>
                            <div class="history-title">${escapeHtml(entry.title)}</div>
                            <div class="history-url">${escapeHtml(entry.url)}</div>
                            <div class="history-time">${timeAgo}</div>
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="history-open" data-url="${escapeHtml(entry.url)}">
                            <i class="fa-regular fa-arrow-up-right-from-square"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fa-regular fa-clock"></i> Browse History</h2>
                <button class="modal-close" id="close-history">
                    <i class="fa-regular fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="history-list">
                    ${historyHTML}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal
    document.getElementById('close-history').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    // Open history item
    modal.querySelectorAll('.history-open').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            if (window.handleSearch) {
                window.handleSearch(url);
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
    });
}

// ============ SEARCH ENGINE SELECTOR ============
function getSearchEngineUrl(query) {
    const engine = localStorage.getItem('searchEngine') || 'duckduckgo';
    const engines = {
        'duckduckgo': `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`,
        'google': `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        'bing': `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        'brave': `https://search.brave.com/search?q=${encodeURIComponent(query)}`
    };
    return engines[engine] || engines.duckduckgo;
}

// ============ UTILITY FUNCTIONS ============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// ============ INTEGRATE WITH EXISTING SEARCH ============
// Hook into handleSearch to add history
if (window.handleSearch) {
    const originalHandleSearch = window.handleSearch;
    window.handleSearch = function(query) {
        historyManager.addEntry(query, query);
        return originalHandleSearch.apply(this, arguments);
    };
}

// Export functions globally
window.applyTheme = applyTheme;
window.toggleParticles = toggleParticles;
window.showBookmarksModal = showBookmarksModal;
window.showHistoryModal = showHistoryModal;
window.getSearchEngineUrl = getSearchEngineUrl;
window.bookmarksManager = bookmarksManager;
window.historyManager = historyManager;
