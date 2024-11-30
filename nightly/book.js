"use strict";

// Fix back button cache problem
window.onunload = function () { };

// Syntax highlighting Configuration
hljs.configure({
	tabReplace: '    ', // 4 spaces
	languages: [],      // Languages used for auto-detection
});

document.querySelectorAll('code').forEach((block) => {
	hljs.highlightBlock(block);
	block.classList.add('hljs');
});

if (window.playground_copyable) {
	document.querySelectorAll('pre code').forEach((block) => {
		const pre_block = block.parentNode;
		if (!pre_block.classList.contains('playground')) {
			let buttons = pre_block.querySelector(".buttons");
			if (!buttons) {
				buttons = document.createElement('div');
				buttons.className = 'buttons';
				pre_block.insertBefore(buttons, pre_block.firstChild);
			}

			const clipButton = document.createElement('button');
			clipButton.className = 'fa fa-regular fa-paste clip-button';
			clipButton.title = 'Copy to clipboard';
			clipButton.setAttribute('aria-label', clipButton.title);
			clipButton.innerHTML = '<i class=\"tooltiptext\"></i>';

			const wrapButton = document.createElement('button');
			wrapButton.className = 'fa fa-solid fa-paragraph wrap-button';
			wrapButton.title = 'Wrap code'
			wrapButton.setAttribute('aria-label', wrapButton.title);

			buttons.insertBefore(clipButton, buttons.firstChild);
			buttons.insertBefore(wrapButton, buttons.firstChild);
		}
	});
}

(function themes() {
	const html = document.querySelector('html');
	const themeToggleButton = document.getElementById('theme-toggle');
	const themePopup = document.getElementById('theme-list');
	const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
	const stylesheets = {
		ayuHighlight: document.querySelector("[href$='ayu-highlight.css']"),
		tomorrowNight: document.querySelector("[href$='tomorrow-night.css']"),
		highlight: document.querySelector("[href$='highlight.css']"),
	};

	function showThemes() {
		themePopup.style.display = 'block';
		themeToggleButton.setAttribute('aria-expanded', true);
		themePopup.querySelector("button" + document.body.className).focus();
	}

	function hideThemes() {
		themePopup.style.display = 'none';
		themeToggleButton.setAttribute('aria-expanded', false);
		themeToggleButton.focus();
	}

	function set_theme(theme, store = true) {
		let ace_theme;

		if (theme == 'coal' || theme == 'navy' || theme == 'bdfd' || theme == "green" || theme == "ios" || theme == "shiro" || theme == "gluo" || theme == "kneon" || theme == "terminal" || theme == "highcon" || theme == "discord") {
			stylesheets.ayuHighlight.disabled = true;
			stylesheets.tomorrowNight.disabled = false;
			stylesheets.highlight.disabled = true;
			ace_theme = "ace/theme/tomorrow_night";
		} else if (theme == 'ayu') {
			stylesheets.ayuHighlight.disabled = false;
			stylesheets.tomorrowNight.disabled = true;
			stylesheets.highlight.disabled = true;
			ace_theme = "ace/theme/tomorrow_night";
		} else {
			stylesheets.ayuHighlight.disabled = true;
			stylesheets.tomorrowNight.disabled = true;
			stylesheets.highlight.disabled = false;
			ace_theme = "ace/theme/dawn";
		}

		const menuBar = document.getElementById("menu-bar-sticky-container");
		const sideBarToggle = document.getElementById("sidebar-toggle");
		const themeToggle = document.getElementById("theme-toggle");
		const searchToggle = document.getElementById("search-toggle");
		const printToggle = document.getElementById("print-button");
		const githubLink = document.getElementById("git-repository-button");
		const gitEdit = document.getElementById("git-edit-button");

		if (theme == 'bdfd') {
			menuBar.style.backgroundColor = '#673ab7';
			menuBar.style.color = '#fff';
			sideBarToggle.style.color = '#fff';
			themeToggle.style.color = '#fff';
			searchToggle.style.color = '#fff';
			printToggle.style.color = '#fff';
			githubLink.style.color = '#fff';
			gitEdit.style.color = '#fff';
		} else {
			menuBar.style.backgroundColor = '';
			menuBar.style.color = '';
			sideBarToggle.style.color = '';
			themeToggle.style.color = '';
			searchToggle.style.color = '';
			printToggle.style.color = '';
			githubLink.style.color = '';
			gitEdit.style.color = '';
		}

		setTimeout(() => {
			themeColorMetaTag.content = getComputedStyle(document.body).backgroundColor;
		}, 1);

		if (window.ace && window.editors) {
			window.editors.forEach((editor) => {
				editor.setTheme(ace_theme);
			});
		}

		let previousTheme;
		try { previousTheme = localStorage.getItem('mdbook-theme'); } catch (e) { }
		if (previousTheme === null || previousTheme === undefined) { previousTheme = default_theme; }

		if (store) {
			try { localStorage.setItem('mdbook-theme', theme); } catch (e) { }
		}

		html.classList.remove(previousTheme);
		html.classList.add(theme);
	}

	// Set theme
	let theme;
	try { theme = localStorage.getItem('mdbook-theme'); } catch (e) { }
	if (theme === null || theme === undefined) { theme = default_theme; }

	set_theme(theme, false);

	themeToggleButton.addEventListener('click', () => {
		if (themePopup.style.display === 'block') {
			hideThemes();
		} else {
			showThemes();
		}
	});

	themePopup.addEventListener('click', (e) => {
		var theme = e.target.id || e.target.parentElement.id;
		set_theme(theme);
	});

	themePopup.addEventListener('focusout', (e) => {
		// e.relatedTarget is null in Safari and Firefox on macOS (see workaround below)
		if (!!e.relatedTarget && !themeToggleButton.contains(e.relatedTarget) && !themePopup.contains(e.relatedTarget)) {
			hideThemes();
		}
	});

	// Should not be needed, but it works around an issue on macOS & iOS: https://github.com/rust-lang/mdBook/issues/628
	document.addEventListener('click', (e) => {
		if (themePopup.style.display === 'block' && !themeToggleButton.contains(e.target) && !themePopup.contains(e.target)) {
			hideThemes();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) { return; }
		if (!themePopup.contains(e.target)) { return; }

		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				hideThemes();
				break;
			case 'ArrowUp':
				e.preventDefault();
				var li = document.activeElement.parentElement;
				if (li && li.previousElementSibling) {
					li.previousElementSibling.querySelector('button').focus();
				}
				break;
			case 'ArrowDown':
				e.preventDefault();
				var li = document.activeElement.parentElement;
				if (li && li.nextElementSibling) {
					li.nextElementSibling.querySelector('button').focus();
				}
				break;
			case 'Home':
				e.preventDefault();
				themePopup.querySelector('li:first-child button').focus();
				break;
			case 'End':
				e.preventDefault();
				themePopup.querySelector('li:last-child button').focus();
				break;
		}
	});
})();

(function sidebar() {
	const html = document.querySelector("html");
	const sidebar = document.getElementById("sidebar");
	const sidebarScrollBox = document.getElementById("sidebar-scrollbox");
	const sidebarLinks = document.querySelectorAll('#sidebar a');
	const sidebarToggleButton = document.getElementById("sidebar-toggle");
	const sidebarResizeHandle = document.getElementById("sidebar-resize-handle");
	let firstContact = null;

	function showSidebar() {
		html.classList.remove('sidebar-hidden')
		html.classList.add('sidebar-visible');
		Array.from(sidebarLinks).forEach((link) => {
			link.setAttribute('tabIndex', 0);
		});
		sidebarToggleButton.setAttribute('aria-expanded', true);
		sidebar.setAttribute('aria-hidden', false);
		try { localStorage.setItem('mdbook-sidebar', 'visible'); } catch (e) { }
	}


	const sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');

	function toggleSection(ev) {
		ev.currentTarget.parentElement.classList.toggle('expanded');
	}

	sidebarAnchorToggles.forEach((el) => {
		el.addEventListener('click', toggleSection);
	});

	function hideSidebar() {
		html.classList.remove('sidebar-visible')
		html.classList.add('sidebar-hidden');
		sidebarLinks.forEach((link) => {
			link.setAttribute('tabIndex', -1);
		});
		sidebarToggleButton.setAttribute('aria-expanded', false);
		sidebar.setAttribute('aria-hidden', true);
		try { localStorage.setItem('mdbook-sidebar', 'hidden'); } catch (e) { }
	}

	// Toggle sidebar
	sidebarToggleButton.addEventListener('click', () => {
		if (html.classList.contains("sidebar-hidden")) {
			showSidebar();
		} else if (html.classList.contains("sidebar-visible")) {
			hideSidebar();
		} else {
			if (getComputedStyle(sidebar)['transform'] === 'none') {
				hideSidebar();
			} else {
				showSidebar();
			}
		}
	});

	sidebarResizeHandle.addEventListener('mousedown', initResize, false);

	function initResize() {
		window.addEventListener('mousemove', resize, false);
		window.addEventListener('mouseup', stopResize, false);
		html.classList.add('sidebar-resizing');
	}
	function resize(e) {
		document.documentElement.style.setProperty('--sidebar-width', (e.clientX - sidebar.offsetLeft) + 'px');
	}
	//on mouseup remove windows functions mousemove & mouseup
	function stopResize() {
		html.classList.remove('sidebar-resizing');
		window.removeEventListener('mousemove', resize, false);
		window.removeEventListener('mouseup', stopResize, false);
	}

	document.addEventListener('touchstart', (e) => {
		firstContact = {
			x: e.touches[0].clientX,
			time: Date.now()
		};
	}, { passive: true });

	document.addEventListener('touchmove', (e) => {
		if (!firstContact)
			return;

		var curX = e.touches[0].clientX;
		var xDiff = curX - firstContact.x,
			tDiff = Date.now() - firstContact.time;

		if (tDiff < 250 && Math.abs(xDiff) >= 150) {
			if (xDiff >= 0 && firstContact.x < Math.min(document.body.clientWidth * 0.25, 300))
				showSidebar();
			else if (xDiff < 0 && curX < 300)
				hideSidebar();

			firstContact = null;
		}
	}, { passive: true });

	// Scroll sidebar to current active section
	const activeSection = sidebar.querySelector(".active");
	if (activeSection) {
		sidebarScrollBox.scrollTop = activeSection.offsetTop;
	}
})();

(function chapterNavigation() {
	document.addEventListener('keydown', (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) { return; }
		if (window.search && window.search.hasFocus()) { return; }

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				var nextButton = document.querySelector('.nav-chapters.next');
				if (nextButton) {
					window.location.href = nextButton.href;
				}
				break;
			case 'ArrowLeft':
				e.preventDefault();
				var previousButton = document.querySelector('.nav-chapters.previous');
				if (previousButton) {
					window.location.href = previousButton.href;
				}
				break;
		}
	});
})();

(function clipboard() {
	const clipButtons = document.querySelectorAll('.clip-button');

	function hideTooltip(elem) {
		elem.firstChild.innerText = "";
		elem.className = 'fa far fa-clipboard clip-button';
	}

	function showTooltip(elem, msg) {
		elem.firstChild.innerText = msg;
		elem.className = 'fa far fa-clipboard tooltipped';
	}

	const clipboardSnippets = new ClipboardJS('.clip-button', {
		text: (trigger) => {
			hideTooltip(trigger);
			const playground = trigger.closest("pre");
			return playground.querySelector("code").textContent;
		}
	});

	clipButtons.forEach((clipButton) => {
		clipButton.addEventListener('mouseout', (e) => {
			hideTooltip(e.currentTarget);
		});
	});

	clipboardSnippets.on('success', (e) => {
		e.clearSelection();
		showTooltip(e.trigger, "Copied!");
	});

	clipboardSnippets.on('error', (e) => {
		showTooltip(e.trigger, "Clipboard error!");
	});
})();

(function wrap() {
	const wrapButtons = document.querySelectorAll(".wrap-button");
	wrapButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
			const playground = button.closest("pre");
			const codeBlock = playground.querySelector("code");
			if (!codeBlock.style.textWrap || codeBlock.style.textWrap === 'nowrap') {
			    codeBlock.style.textWrap = 'wrap';
			} else {
			    codeBlock.style.textWrap = 'nowrap';
			}
		});
	});
})();

(function scrollToTop() {
	const menuTitle = document.querySelector('.menu-title');

	menuTitle.addEventListener('click', () => {
		document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
	});
})();

(function autoHideMenu() {
	var menu = document.getElementById('menu-bar');

	var previousScrollTop = document.scrollingElement.scrollTop;

	document.addEventListener('scroll', () => {
		if (menu.classList.contains('folded') && document.scrollingElement.scrollTop < previousScrollTop) {
			menu.classList.remove('folded');
		} else if (!menu.classList.contains('folded') && document.scrollingElement.scrollTop > previousScrollTop) {
			menu.classList.add('folded');
		}

		if (!menu.classList.contains('bordered') && document.scrollingElement.scrollTop > 0) {
			menu.classList.add('bordered');
		}

		if (menu.classList.contains('bordered') && document.scrollingElement.scrollTop === 0) {
			menu.classList.remove('bordered');
		}

		previousScrollTop = Math.max(document.scrollingElement.scrollTop, 0);
	}, { passive: true });
})();
