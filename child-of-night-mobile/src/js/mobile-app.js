/**
 * Child of the Night Mobile Browser
 * Main application logic for mobile
 */

class CotnMobileBrowser {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createNewTab('about:home', 'Home');
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.getElementById('back-btn').addEventListener('click', () => this.goBack());
        document.getElementById('forward-btn').addEventListener('click', () => this.goForward());
        document.getElementById('refresh-btn').addEventListener('click', () => this.refresh());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
        document.getElementById('share-btn').addEventListener('click', () => this.shareCurrentPage());

        // Address bar
        document.getElementById('address-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.navigateToURL(e.target.value);
        });
        document.getElementById('search-btn').addEventListener('click', () => {
            this.navigateToURL(document.getElementById('address-input').value);
        });

        // Menu
        document.getElementById('menu-btn').addEventListener('click', () => this.toggleMenu());
        document.getElementById('close-menu').addEventListener('click', () => this.closeMenu());
        document.getElementById('modal-overlay').addEventListener('click', () => this.closeAllPanels());

        // Menu items
        document.getElementById('menu-history').addEventListener('click', () => {
            this.closeMenu();
            this.showHistory();
        });
        document.getElementById('menu-bookmarks').addEventListener('click', () => {
            this.closeMenu();
            this.showBookmarks();
        });
        document.getElementById('menu-settings').addEventListener('click', () => {
            this.closeMenu();
            this.showSettings();
        });
        document.getElementById('menu-share').addEventListener('click', () => {
            this.closeMenu();
            this.shareCurrentPage();
        });
        document.getElementById('menu-refresh').addEventListener('click', () => {
            this.closeMenu();
            this.refresh();
        });

        // Tabs
        document.getElementById('new-tab-btn').addEventListener('click', () => this.createNewTab());

        // History panel
        document.getElementById('close-history').addEventListener('click', () => this.closeAllPanels());
        document.getElementById('history-search').addEventListener('input', (e) => this.searchHistory(e.target.value));

        // Bookmarks panel
        document.getElementById('close-bookmarks').addEventListener('click', () => this.closeAllPanels());
        document.getElementById('bookmark-current').addEventListener('click', () => this.bookmarkCurrentPage());

        // Settings panel
        document.getElementById('close-settings').addEventListener('click', () => this.closeAllPanels());
        document.getElementById('https-only').addEventListener('change', (e) => {
            securityManager.settings.httpsOnly = e.target.checked;
            securityManager.saveSettings();
        });
        document.getElementById('block-tracking').addEventListener('change', (e) => {
            securityManager.settings.blockTracking = e.target.checked;
            securityManager.saveSettings();
        });
        document.getElementById('block-cookies').addEventListener('change', (e) => {
            securityManager.settings.blockThirdPartyCookies = e.target.checked;
            securityManager.saveSettings();
        });
        document.getElementById('clear-history-mobile').addEventListener('click', () => this.clearHistoryMobile());
        document.getElementById('clear-cache-mobile').addEventListener('click', () => this.clearCacheMobile());

        // Prevent zoom
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    /**
     * Create new tab
     */
    createNewTab(url = 'about:home', title = 'New Tab') {
        const tab = tabManager.createTab(url, title);
        this.renderTab(tab);
        this.switchToTab(tab.id);
    }

    /**
     * Render tab in tab bar
     */
    renderTab(tab) {
        const container = document.getElementById('tabs-container');
        const tabEl = document.createElement('div');
        tabEl.className = 'tab';
        tabEl.id = `tab-${tab.id}`;
        tabEl.innerHTML = `
            <span class="tab-title">${this.escapeHtml(tab.title.substring(0, 15))}</span>
            <span class="tab-close">✕</span>
        `;
        tabEl.addEventListener('click', () => this.switchToTab(tab.id));
        tabEl.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tab.id);
        });
        container.appendChild(tabEl);
    }

    /**
     * Switch to tab
     */
    switchToTab(id) {
        tabManager.setActiveTab(id);
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const tabEl = document.getElementById(`tab-${id}`);
        if (tabEl) tabEl.classList.add('active');

        const tab = tabManager.getActiveTab();
        document.getElementById('address-input').value = tab.url;
        this.updateSecurityIcon(tab.url);
        this.closeAllPanels();
    }

    /**
     * Close tab
     */
    closeTab(id) {
        tabManager.closeTab(id);
        const tabEl = document.getElementById(`tab-${id}`);
        if (tabEl) tabEl.remove();
        const active = tabManager.getActiveTab();
        if (active) this.switchToTab(active.id);
    }

    /**
     * Navigate to URL
     */
    navigateToURL(url) {
        if (!url) return;

        if (!url.startsWith('http') && !url.startsWith('about:')) {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }

        const validation = securityManager.validateURL(url);
        if (!validation.valid) {
            alert('Security blocked: ' + validation.reason);
            return;
        }

        const tab = tabManager.getActiveTab();
        if (tab) {
            tab.url = validation.url;
            tab.title = validation.url;
            historyManager.addEntry(validation.url, tab.title);
            document.getElementById('address-input').value = validation.url;
            this.updateSecurityIcon(validation.url);
        }
    }

    /**
     * Navigation methods
     */
    goBack() { console.log('[Navigation] Back'); }
    goForward() { console.log('[Navigation] Forward'); }
    refresh() { console.log('[Navigation] Refresh'); }
    goHome() { this.navigateToURL('about:home'); }

    /**
     * Share current page
     */
    shareCurrentPage() {
        const tab = tabManager.getActiveTab();
        if (tab && navigator.share) {
            navigator.share({
                title: tab.title,
                url: tab.url
            }).catch(err => console.error('Share failed:', err));
        } else {
            alert('Share: ' + tab.url);
        }
    }

    /**
     * Update security icon
     */
    updateSecurityIcon(url) {
        const status = securityManager.getSecurityStatus(url);
        const icon = document.getElementById('security-icon');
        icon.textContent = status.icon;
        icon.title = status.status;
    }

    /**
     * Toggle menu
     */
    toggleMenu() {
        const menu = document.getElementById('side-menu');
        menu.classList.toggle('hidden');
        document.getElementById('modal-overlay').classList.toggle('hidden');
    }

    /**
     * Close menu
     */
    closeMenu() {
        document.getElementById('side-menu').classList.add('hidden');
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    /**
     * Show history panel
     */
    showHistory() {
        document.getElementById('bookmarks-panel').classList.add('hidden');
        document.getElementById('settings-panel').classList.add('hidden');
        document.getElementById('history-panel').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');

        const list = document.getElementById('history-list');
        list.innerHTML = '';
        historyManager.getHistory(50).forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="item-title">${this.escapeHtml(entry.title)}</span>
                <span class="item-url">${this.escapeHtml(entry.url)}</span>
            `;
            item.addEventListener('click', () => {
                this.navigateToURL(entry.url);
                this.closeAllPanels();
            });
            list.appendChild(item);
        });
    }

    /**
     * Search history
     */
    searchHistory(query) {
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        const results = historyManager.searchHistory(query);
        results.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="item-title">${this.escapeHtml(entry.title)}</span>
                <span class="item-url">${this.escapeHtml(entry.url)}</span>
            `;
            item.addEventListener('click', () => {
                this.navigateToURL(entry.url);
                this.closeAllPanels();
            });
            list.appendChild(item);
        });
    }

    /**
     * Show bookmarks panel
     */
    showBookmarks() {
        document.getElementById('history-panel').classList.add('hidden');
        document.getElementById('settings-panel').classList.add('hidden');
        document.getElementById('bookmarks-panel').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');

        const list = document.getElementById('bookmarks-list');
        list.innerHTML = '';
        bookmarksManager.getBookmarks().forEach(bm => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';
            item.innerHTML = `
                <span class="item-title">★ ${this.escapeHtml(bm.title)}</span>
                <span class="item-url">${this.escapeHtml(bm.url)}</span>
            `;
            item.addEventListener('click', () => {
                this.navigateToURL(bm.url);
                this.closeAllPanels();
            });
            list.appendChild(item);
        });
    }

    /**
     * Bookmark current page
     */
    bookmarkCurrentPage() {
        const tab = tabManager.getActiveTab();
        if (tab && bookmarksManager.addBookmark(tab.url, tab.title)) {
            alert('Bookmark added!');
        } else {
            alert('Already bookmarked or invalid URL');
        }
    }

    /**
     * Show settings panel
     */
    showSettings() {
        document.getElementById('history-panel').classList.add('hidden');
        document.getElementById('bookmarks-panel').classList.add('hidden');
        document.getElementById('settings-panel').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');

        // Load current settings
        document.getElementById('https-only').checked = securityManager.settings.httpsOnly;
        document.getElementById('block-tracking').checked = securityManager.settings.blockTracking;
        document.getElementById('block-cookies').checked = securityManager.settings.blockThirdPartyCookies;
    }

    /**
     * Clear history
     */
    clearHistoryMobile() {
        if (confirm('Clear all history?')) {
            historyManager.clearHistory();
            alert('History cleared');
        }
    }

    /**
     * Clear cache
     */
    clearCacheMobile() {
        if (confirm('Clear cache?')) {
            alert('Cache cleared');
        }
    }

    /**
     * Close all panels
     */
    closeAllPanels() {
        document.getElementById('side-menu').classList.add('hidden');
        document.getElementById('history-panel').classList.add('hidden');
        document.getElementById('bookmarks-panel').classList.add('hidden');
        document.getElementById('settings-panel').classList.add('hidden');
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    /**
     * Update time display
     */
    updateTime() {
        const time = new Date();
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        document.querySelector('.status-time').textContent = `${hours}:${minutes}`;
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cotnMobileBrowser = new CotnMobileBrowser();
});