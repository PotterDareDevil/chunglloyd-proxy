document.addEventListener('DOMContentLoaded', function() {
	const settingsMenu = document.getElementById('settings-menu');
	settingsMenu.innerHTML = `
  <h2>Settings</h2>
  <div class="settings-tabs">
    <button class="tab-button active" id="proxy-tab"><i class="fa-regular fa-server"></i> Proxy</button>
    <button class="tab-button" id="cloak-tab"><i class="fa-regular fa-user-secret"></i> Cloak</button>
    <button class="tab-button" id="appearance-tab"><i class="fa-regular fa-palette"></i> Appearance</button>
    <button class="tab-button" id="features-tab"><i class="fa-regular fa-stars"></i> Features</button>
  </div>
  <div id="proxy-content" class="tab-content active">
    <label for="transport-selector">Transport</label>
    <p>Transport is how the proxy will send information.</p>
    <div class="transport-selector">
      <div class="transport-selected">Epoxy</div>
      <div class="transport-options">
        <div>Epoxy</div>
        <div>Libcurl</div>
      </div>
    </div>
    <label for="wisp-server">Wisp Server</label>
    <p>Enter a different Wisp Server to connect to.</p>
    <p>Recommended to keep this as default.</p>
    <input type="text" id="wisp-server" placeholder="Wisp Server URL Here..." autocomplete="off">
    <button id="save-wisp-url">Save</button>
  </div>
  <div id="cloak-content" class="tab-content">
    <label for="aboutblank-toggle">About:Blank</label>
    <p>Turn this on to go into about:blank every time the page loads (Recommended).</p>
    <input type="checkbox" id="aboutblank-toggle">
  </div>
  <div id="appearance-content" class="tab-content">
    <div class="scale-container">
        <label for="ui-scale-slider">UI Scale</label>
        <p>Adjust the size of the entire interface (50% - 200%)</p>
        <div class="scale-slider-wrapper">
            <input type="range" id="ui-scale-slider" min="50" max="200" value="100" step="5">
            <span class="scale-value" id="scale-value">100%</span>
            <button class="scale-reset" id="scale-reset">Reset</button>
        </div>
    </div>
    <label for="theme-selector">Theme</label>
    <p>Choose your color scheme</p>
    <div class="theme-selector">
      <div class="theme-option active" data-theme="teal">
        <div class="theme-preview" style="background: linear-gradient(135deg, #00D9FF, #00eeff);"></div>
        <span>Teal (Default)</span>
      </div>
      <div class="theme-option" data-theme="purple">
        <div class="theme-preview" style="background: linear-gradient(135deg, #a855f7, #c084fc);"></div>
        <span>Purple</span>
      </div>
      <div class="theme-option" data-theme="red">
        <div class="theme-preview" style="background: linear-gradient(135deg, #ef4444, #f87171);"></div>
        <span>Red</span>
      </div>
      <div class="theme-option" data-theme="green">
        <div class="theme-preview" style="background: linear-gradient(135deg, #10b981, #34d399);"></div>
        <span>Green</span>
      </div>
    </div>
    <label for="particles-toggle">Background Particles</label>
    <p>Toggle floating particle effects</p>
    <input type="checkbox" id="particles-toggle" checked>
    <label for="navbar-toggle">Navigation Bar</label>
    <p>Keep this on for the navigation bar when searching (Recommended).</p>
    <input type="checkbox" id="navbar-toggle">
  </div>
  <div id="features-content" class="tab-content">
    <label for="search-engine-selector">Default Search Engine</label>
    <p>Choose which search engine to use</p>
    <div class="search-engine-selector">
      <div class="search-selected">DuckDuckGo</div>
      <div class="search-options">
        <div data-engine="duckduckgo">DuckDuckGo</div>
        <div data-engine="google">Google</div>
        <div data-engine="bing">Bing</div>
        <div data-engine="brave">Brave Search</div>
      </div>
    </div>
    <label for="history-toggle">Browse History</label>
    <p>Save your browsing history locally</p>
    <input type="checkbox" id="history-toggle" checked>
    <button id="clear-history-btn" class="feature-button">
      <i class="fa-regular fa-trash"></i> Clear History
    </button>
    <button id="view-history-btn" class="feature-button">
      <i class="fa-regular fa-clock"></i> View History
    </button>
    <label for="bookmarks-section">Bookmarks</label>
    <p>Manage your saved sites</p>
    <button id="manage-bookmarks-btn" class="feature-button">
      <i class="fa-regular fa-bookmark"></i> Manage Bookmarks
    </button>
  </div>
  <button id="close-settings"><i class="fa-regular fa-times"></i></button>
  `;
	
	const settingsIcon = document.getElementById('settings-icon');
	const closeSettingsButton = document.getElementById('close-settings');
	const saveButton = document.getElementById('save-wisp-url');
	const transportSelector = document.querySelector('.transport-selector');
	const transportSelected = transportSelector.querySelector('.transport-selected');
	const transportOptions = transportSelector.querySelector('.transport-options');
	const navbarToggle = document.getElementById('navbar-toggle');
	const defaultWispUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/w/`;
	let currentWispUrl = localStorage.getItem('customWispUrl') || defaultWispUrl;
	const wispInput = document.querySelector("#wisp-server");
	wispInput.value = currentWispUrl;

	// UI Scale Feature
	const uiScaleSlider = document.getElementById('ui-scale-slider');
	const scaleValue = document.getElementById('scale-value');
	const scaleReset = document.getElementById('scale-reset');
	
	const savedScale = localStorage.getItem('uiScale') || '100';
	if (uiScaleSlider) {
		uiScaleSlider.value = savedScale;
		if (scaleValue) scaleValue.textContent = savedScale + '%';
		applyUIScale(savedScale);
	}
	
	if (uiScaleSlider) {
		uiScaleSlider.addEventListener('input', (e) => {
			const scale = e.target.value;
			if (scaleValue) scaleValue.textContent = scale + '%';
			applyUIScale(scale);
			localStorage.setItem('uiScale', scale);
		});
	}
	
	if (scaleReset) {
		scaleReset.addEventListener('click', () => {
			uiScaleSlider.value = 100;
			if (scaleValue) scaleValue.textContent = '100%';
			applyUIScale(100);
			localStorage.setItem('uiScale', '100');
			showToast('success', 'UI Scale reset to 100%');
		});
	}
	
	function applyUIScale(scale) {
		const scaleDecimal = scale / 100;
		document.body.style.zoom = scaleDecimal;
	}

	// Theme Selector
	const themeOptions = document.querySelectorAll('.theme-option');
	const savedTheme = localStorage.getItem('clgTheme') || 'teal';
	
	themeOptions.forEach(option => {
		if (option.dataset.theme === savedTheme) {
			option.classList.add('active');
		}
		
		option.addEventListener('click', () => {
			themeOptions.forEach(opt => opt.classList.remove('active'));
			option.classList.add('active');
			const theme = option.dataset.theme;
			localStorage.setItem('clgTheme', theme);
			applyTheme(theme);
			showToast('success', `Theme changed to ${theme}`);
		});
	});
	
	// Apply saved theme on load
	applyTheme(savedTheme);

	// Particles Toggle
	const particlesToggle = document.getElementById('particles-toggle');
	const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
	particlesToggle.checked = particlesEnabled;
	
	particlesToggle.addEventListener('change', () => {
		localStorage.setItem('particlesEnabled', particlesToggle.checked);
		toggleParticles(particlesToggle.checked);
		showToast(particlesToggle.checked ? 'success' : 'error', `Particles ${particlesToggle.checked ? 'enabled' : 'disabled'}`);
	});

	// Search Engine Selector
	const searchEngineSelector = document.querySelector('.search-engine-selector');
	const searchSelected = searchEngineSelector.querySelector('.search-selected');
	const searchOptions = searchEngineSelector.querySelector('.search-options');
	
	const savedEngine = localStorage.getItem('searchEngine') || 'duckduckgo';
	const engineNames = {
		'duckduckgo': 'DuckDuckGo',
		'google': 'Google',
		'bing': 'Bing',
		'brave': 'Brave Search'
	};
	searchSelected.textContent = engineNames[savedEngine];
	
	searchSelected.addEventListener('click', (e) => {
		e.stopPropagation();
		searchOptions.classList.toggle('search-show');
	});
	
	searchOptions.querySelectorAll('div').forEach(option => {
		option.addEventListener('click', (e) => {
			e.stopPropagation();
			const engine = option.dataset.engine;
			searchSelected.textContent = engineNames[engine];
			localStorage.setItem('searchEngine', engine);
			searchOptions.classList.remove('search-show');
			showToast('success', `Search engine changed to ${engineNames[engine]}`);
		});
	});

	// History Toggle
	const historyToggle = document.getElementById('history-toggle');
	const historyEnabled = localStorage.getItem('historyEnabled') !== 'false';
	historyToggle.checked = historyEnabled;
	
	historyToggle.addEventListener('change', () => {
		localStorage.setItem('historyEnabled', historyToggle.checked);
		showToast(historyToggle.checked ? 'success' : 'error', `History ${historyToggle.checked ? 'enabled' : 'disabled'}`);
	});

	// Clear History Button
	document.getElementById('clear-history-btn').addEventListener('click', () => {
		if (confirm('Are you sure you want to clear your browsing history?')) {
			localStorage.removeItem('proxyHistory');
			showToast('success', 'History cleared!');
		}
	});

	// View History Button
	document.getElementById('view-history-btn').addEventListener('click', () => {
		showHistoryModal();
	});

	// Manage Bookmarks Button
	document.getElementById('manage-bookmarks-btn').addEventListener('click', () => {
		showBookmarksModal();
	});

	function isValidUrl(url) {
		try {
			const parsedUrl = new URL(url);
			return (parsedUrl.protocol === "wss:" || parsedUrl.protocol === "ws:") && url.endsWith('/');
		} catch (_) {
			return false;
		}
	}

	function updateWispServerUrl(url) {
		if (isValidUrl(url)) {
			currentWispUrl = url;
			localStorage.setItem('customWispUrl', url);
			document.dispatchEvent(new CustomEvent('wispUrlChanged', {
				detail: currentWispUrl
			}));
			wispInput.value = currentWispUrl;
			showToast('success', `WISP URL successfully updated to: ${currentWispUrl}`);
			location.reload();
		} else {
			console.log("%c[❌]%c Invalid WISP URL. Please enter a valid one.", "color: red; font-weight: bold;", "color: inherit;");
			currentWispUrl = defaultWispUrl;
			localStorage.setItem('customWispUrl', defaultWispUrl);
			wispInput.value = defaultWispUrl;
			showToast('error', "Invalid URL. Reverting back to default...");
			location.reload();
		}
	}
	
	saveButton.addEventListener('click', () => {
		const customUrl = wispInput.value.trim();
		updateWispServerUrl(customUrl);
	});
	
	settingsIcon.addEventListener('click', (event) => {
		event.preventDefault();
		toggleSettingsMenu();
	});
	
	closeSettingsButton.addEventListener('click', () => {
		toggleSettingsMenu();
	});

	function toggleSettingsMenu() {
		const icon = document.querySelector('#settings-icon i.settings-icon');
		if (settingsMenu.classList.contains('open')) {
		  settingsMenu.classList.add('close');
		  icon.classList.remove('fa-solid');
		  icon.classList.add('fa-regular');
		  setTimeout(() => {
			settingsMenu.classList.remove('open', 'close');
		  }, 300);
		} else {
		  settingsMenu.classList.add('open');
		  icon.classList.remove('fa-regular');
		  icon.classList.add('fa-solid');
		  setTimeout(() => {
			settingsMenu.classList.remove('close');
		  }, 300);
		}
	}
	
	transportSelected.addEventListener('click', function(e) {
		e.stopPropagation();
		transportOptions.classList.toggle('transport-show');
		this.classList.toggle('transport-arrow-active');
	});
	
	const optionDivs = transportOptions.getElementsByTagName('div');
	for (let i = 0; i < optionDivs.length; i++) {
		optionDivs[i].addEventListener('click', function(e) {
			e.stopPropagation();
			const selectedValue = this.innerHTML;
			transportSelected.innerHTML = selectedValue;
			localStorage.setItem('transport', selectedValue.toLowerCase());
			transportOptions.classList.remove('transport-show');
			transportSelected.classList.remove('transport-arrow-active');
			const event = new Event('newTransport', {
				detail: selectedValue.toLowerCase()
			});
			document.dispatchEvent(event);
			showToast('success', `Transport successfully changed to ${selectedValue}`);
			location.reload();
		});
	}

	function switchTab(tabId, contentId, ...otherTabs) {
		// Hide all other tabs
		for (let i = 0; i < otherTabs.length; i += 2) {
			document.getElementById(otherTabs[i + 1]).classList.remove('active');
			document.getElementById(otherTabs[i]).classList.remove('active');
		}
		document.getElementById(contentId).classList.add('active');
		document.getElementById(tabId).classList.add('active');
	}
	
	document.getElementById('proxy-tab').addEventListener('click', function() {
		switchTab('proxy-tab', 'proxy-content', 'appearance-tab', 'appearance-content', 'cloak-tab', 'cloak-content', 'features-tab', 'features-content');
	});
	document.getElementById('cloak-tab').addEventListener('click', function() {
		switchTab('cloak-tab', 'cloak-content', 'proxy-tab', 'proxy-content', 'appearance-tab', 'appearance-content', 'features-tab', 'features-content');
	});
	document.getElementById('appearance-tab').addEventListener('click', function() {
		switchTab('appearance-tab', 'appearance-content', 'proxy-tab', 'proxy-content', 'cloak-tab', 'cloak-content', 'features-tab', 'features-content');
	});
	document.getElementById('features-tab').addEventListener('click', function() {
		switchTab('features-tab', 'features-content', 'proxy-tab', 'proxy-content', 'appearance-tab', 'appearance-content', 'cloak-tab', 'cloak-content');
	});
	
	navbarToggle.addEventListener('change', function() {
		if (this.checked) {
			showToast('success', 'Navigation Bar is now enabled.');
		} else {
			showToast('error', 'Navigation Bar is now disabled.');
		}
	});

	function runScriptIfChecked() {
		let inFrame;
		try {
			inFrame = window !== top;
		} catch (e) {
			inFrame = true;
		}
		const aboutBlankChecked = JSON.parse(localStorage.getItem("aboutBlankChecked")) || false;
		if (!aboutBlankChecked || inFrame) {
			return;
		}
		const defaultTitle = "Google.";
		const defaultIcon = "https://www.google.com/favicon.ico";
		const title = localStorage.getItem("siteTitle") || defaultTitle;
		const icon = localStorage.getItem("faviconURL") || defaultIcon;
		const iframeSrc = "/";
		const popup = window.open("", "_blank");
		if (!popup || popup.closed) {
			alert("Failed to load automask. Please allow popups and try again.");
			return;
		}
		popup.document.head.innerHTML = `
        <title>${title}</title>
        <link rel="icon" href="${icon}">
    `;
		popup.document.body.innerHTML = `
        <iframe style="height: 100%; width: 100%; border: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0;" src="${iframeSrc}"></iframe>
    `;
		window.location.replace("https://bisd.schoology.com/home");
	}
	
	document.getElementById("aboutblank-toggle").addEventListener("change", function() {
		localStorage.setItem("aboutBlankChecked", JSON.stringify(this.checked));
		if (this.checked) {
			showToast('success', 'About:Blank is now enabled.');
		} else {
			showToast('error', 'About:Blank is now disabled.');
		}
		runScriptIfChecked();
	});
	
	window.addEventListener("load", function() {
		const aboutBlankChecked = JSON.parse(localStorage.getItem("aboutBlankChecked")) || false;
		document.getElementById("aboutblank-toggle").checked = aboutBlankChecked;
		runScriptIfChecked();
	});

	function showToast(type, message) {
		const toast = document.createElement('div');
		toast.className = `toast ${type} show`;
		const icons = {
			success: '<i class="fa-regular fa-check-circle" style="margin-right: 8px;"></i>',
			error: '<i class="fa-regular fa-times-circle" style="margin-right: 8px;"></i>',
			info: '<i class="fa-regular fa-info-circle" style="margin-right: 8px;"></i>',
			warning: '<i class="fa-regular fa-exclamation-triangle" style="margin-right: 8px;"></i>'
		};
		const icon = icons[type] || '';
		toast.innerHTML = `${icon}${message}`;
		const progressBar = document.createElement('div');
		progressBar.className = 'progress-bar';
		toast.appendChild(progressBar);
		const closeBtn = document.createElement('button');
		closeBtn.className = 'toast-close';
		closeBtn.innerHTML = '<i class="fa-regular fa-xmark" style="margin-left: 8px; font-size: 0.8em;"></i>';
		closeBtn.addEventListener('click', () => {
			toast.classList.remove('show');
			toast.classList.add('hide');
			setTimeout(() => {
				toast.remove();
			}, 500);
		});
		toast.appendChild(closeBtn);
		document.body.appendChild(toast);
		setTimeout(() => {
			toast.classList.remove('show');
			toast.classList.add('hide');
			setTimeout(() => {
				toast.remove();
			}, 500);
		}, 3000);
	}

	window.showToast = showToast;
});
