// Simple Smart navbar functionality
document.addEventListener('DOMContentLoaded', function() {
	// Detect current page location
	const currentPath = window.location.pathname;
	const isInPagesFolder = currentPath.includes('/pages/');
	
	// Load components with proper paths
	const headerPath = isInPagesFolder ? '../components/header.html' : 'components/header.html';
	const footerPath = isInPagesFolder ? '../components/footer.html' : 'components/footer.html';
	
	loadComponent('header', headerPath);
	loadComponent('footer', footerPath);
	
	// Initialize navbar after components load
	setTimeout(function() {
		initializeNavbar();
	}, 200);
});

// Load header and footer components
function loadComponent(id, url) {
	fetch(url)
		.then(response => response.text())
		.then(html => {
			document.getElementById(id).innerHTML = html;
			
			// Fix logo path after loading header
			if (id === 'header') {
				fixLogoPath();
			}
		})
		.catch(error => {
			console.error('Error loading component:', error);
		});
}

// Fix logo path based on current page location
function fixLogoPath() {
	const logoImg = document.getElementById('nav-logo-img');
	if (logoImg) {
		const currentPath = window.location.pathname;
		const isInPagesFolder = currentPath.includes('/pages/');
		
		if (isInPagesFolder) {
			logoImg.src = '../assets/images/ELT8.png';
		} else {
			logoImg.src = 'assets/images/ELT8.png';
		}
	}
}

// Initialize simple navbar functionality
function initializeNavbar() {
	const navToggle = document.getElementById('navToggle');
	const navLinks = document.getElementById('navLinks');
	const navLogo = document.querySelector('.nav-logo');
	
	// Mobile menu toggle
	if (navToggle && navLinks) {
		navToggle.addEventListener('click', function() {
			navLinks.classList.toggle('open');
			navToggle.classList.toggle('active');
		});
		
		// Close mobile menu when clicking outside
		document.addEventListener('click', function(e) {
			if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
				navLinks.classList.remove('open');
				navToggle.classList.remove('active');
			}
		});
	}
	
	// Smart navigation
	setupSmartNavigation();
	
	// Logo click to home
	if (navLogo) {
		navLogo.addEventListener('click', function() {
			navigateToPage('home');
		});
	}
	
	// Set active nav item
	setActiveNavItem();
}

// Setup smart navigation for all nav links
function setupSmartNavigation() {
	const navLinks = document.querySelectorAll('.nav-links a[data-page]');
	
	navLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const page = this.getAttribute('data-page');
			navigateToPage(page);
			
			// Close mobile menu
			const navLinksContainer = document.getElementById('navLinks');
			const navToggle = document.getElementById('navToggle');
			if (navLinksContainer && navToggle) {
				navLinksContainer.classList.remove('open');
				navToggle.classList.remove('active');
			}
		});
	});
}

// Smart navigation function
function navigateToPage(page) {
	const currentPath = window.location.pathname;
	const isInPagesFolder = currentPath.includes('/pages/');
	
	let targetUrl;
	
	if (page === 'home') {
		targetUrl = isInPagesFolder ? '../index.html' : 'index.html';
	} else {
		targetUrl = isInPagesFolder ? `${page}.html` : `pages/${page}.html`;
	}
	
	window.location.href = targetUrl;
}

// Set active navigation item based on current page
function setActiveNavItem() {
	const currentPath = window.location.pathname;
	const navLinks = document.querySelectorAll('.nav-links a[data-page]');
	
	// Remove active class from all links
	navLinks.forEach(link => link.classList.remove('active'));
	
	// Determine current page
	let currentPage = 'home';
	if (currentPath.includes('sermons.html')) currentPage = 'sermons';
	else if (currentPath.includes('gallery.html')) currentPage = 'gallery';
	else if (currentPath.includes('announcements.html')) currentPage = 'announcements';
	else if (currentPath.includes('about.html')) currentPage = 'about';
	else if (currentPath.includes('contact.html')) currentPage = 'contact';
	
	// Set active class
	const activeLink = document.querySelector(`a[data-page="${currentPage}"]`);
	if (activeLink) {
		activeLink.classList.add('active');
	}
}
