// Import Supabase configuration
import { supabase, formatDate, getYouTubeEmbedUrl } from './supabase-config.js';
import { getActiveAnnouncement, getGalleryPhotos } from './supabase-data.js';

// ============================================
// LOADING SCREEN
// ============================================

function hideLoadingScreen() {
	const loadingScreen = document.getElementById('loading-screen');
	if (loadingScreen) {
		setTimeout(() => {
			loadingScreen.classList.add('hidden');
			// Remove from DOM after transition
			setTimeout(() => {
				loadingScreen.remove();
			}, 500);
		}, 800); // Show loading for at least 800ms
	}
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollAnimations() {
	const revealElements = document.querySelectorAll('.scroll-reveal');
	
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('revealed');
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	});
	
	revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

function initPageAnimations() {
	// Animate elements on page load
	const animatedElements = document.querySelectorAll('.animate-on-load');
	animatedElements.forEach((el, index) => {
		el.style.animationDelay = `${index * 0.1}s`;
		el.classList.add('animate-fade-in');
	});
	
	// Add scroll reveal to sections
	const sections = document.querySelectorAll('section');
	sections.forEach(section => {
		if (!section.classList.contains('hero')) {
			section.classList.add('scroll-reveal');
		}
	});
	
	// Add animation to cards
	const cards = document.querySelectorAll('.service-time-card, .sermon-card, .gallery-item, .announcement-item');
	cards.forEach((card, index) => {
		card.classList.add('scroll-reveal');
		card.style.transitionDelay = `${index * 0.1}s`;
	});
	
	initScrollAnimations();
}

// Simple Smart navbar functionality
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM Content Loaded - Initializing website...');
	
	// Detect current page location
	const currentPath = window.location.pathname;
	const isInPagesFolder = currentPath.includes('/pages/');
	
	console.log('Current path:', currentPath);
	console.log('Is in pages folder:', isInPagesFolder);
	
	// Load components with proper paths
	const headerPath = isInPagesFolder ? '../components/header.html' : 'components/header.html';
	const footerPath = isInPagesFolder ? '../components/footer.html' : 'components/footer.html';
	
	console.log('Loading header from:', headerPath);
	console.log('Loading footer from:', footerPath);
	
	loadComponent('header', headerPath);
	loadComponent('footer', footerPath);
	
	// Initialize other features after a slight delay to ensure components are loaded
	setTimeout(function() {
		console.log('Initializing announcements and animations...');
		initializeAnnouncements();
		initializeHeroTextRotation();
		initPageAnimations(); // Initialize animations
		hideLoadingScreen(); // Hide loading screen after everything is loaded
		
		// Load dynamic content based on page
		if (currentPath.includes('sermons.html') || currentPath.includes('/sermons')) {
			loadSermonsPage();
		} else if (currentPath.includes('announcements.html') || currentPath.includes('/announcements')) {
			loadAnnouncementsPage();
		} else if (currentPath.includes('gallery.html') || currentPath.includes('/gallery')) {
			loadGalleryPage();
		} else if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.includes('/home')) {
			loadHomePageContent();
		}
		
		console.log('Initialization complete!');
	}, 200);
});

// Initialize Announcements
async function initializeAnnouncements() {
	// Check if we're on the home page
	const isHomePage = !window.location.pathname.includes('/pages/');
	
	if (!isHomePage) return;
	
	// Try to fetch announcement from backend
	try {
		// First, try to get the active announcement
		const { data: activeData, error: activeError } = await supabase
			.from('announcements')
			.select('*')
			.eq('is_active', true)
			.order('date', { ascending: false })
			.limit(1);
		
		// If there's an active announcement, display it
		if (!activeError && activeData && activeData.length > 0) {
			displayInlineAnnouncement(activeData[0], true);
			return;
		}
		
		// Otherwise, get the most recent announcement
		const { data, error } = await supabase
			.from('announcements')
			.select('*')
			.order('date', { ascending: false })
			.limit(1);
		
		if (!error && data && data.length > 0) {
			displayInlineAnnouncement(data[0], false);
		}
	} catch (error) {
		console.log('Could not load announcement:', error);
	}
}

// Display announcement inline on homepage (new implementation)
function displayInlineAnnouncement(announcement, isActive) {
	if (!announcement) return;
	
	const section = document.getElementById('latestAnnouncementSection');
	const title = document.getElementById('announcement-title');
	const text = document.getElementById('announcement-text');
	const dateEl = document.getElementById('announcement-date');
	const linksContainer = document.getElementById('announcement-links');
	
	if (!section || !title || !text) return;
	
	// Set the content
	title.textContent = announcement.title;
	text.textContent = announcement.text;
	
	// Format and display date
	if (dateEl && announcement.date) {
		const date = new Date(announcement.date);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		dateEl.textContent = date.toLocaleDateString('en-US', options);
	}
	
	// Clear and add action links if available
	linksContainer.innerHTML = '';
	const links = [];
	
	if (announcement.whatsapp_link) {
		links.push(`<a href="${announcement.whatsapp_link}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>`);
	}
	if (announcement.web_link) {
		links.push(`<a href="${announcement.web_link}" target="_blank"><i class="fas fa-globe"></i> More Info</a>`);
	}
	if (announcement.phone_link) {
		const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
		links.push(`<a href="${tel}"><i class="fas fa-phone"></i> Call</a>`);
	}
	if (announcement.email_link) {
		const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
		links.push(`<a href="${mailto}"><i class="fas fa-envelope"></i> Email</a>`);
	}
	
	if (links.length > 0) {
		linksContainer.innerHTML = links.join(' | ');
	}
	
	// Show the section
	section.style.display = 'block';
}

// Handle window resize - removed old announcement banner/sidebar logic

// Load header and footer components
function loadComponent(id, url) {
	console.log(`Loading component: ${id} from ${url}`);
	fetch(url)
		.then(response => {
			console.log(`Response for ${id}:`, response.status);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		})
		.then(html => {
			console.log(`Successfully loaded ${id}`);
			const element = document.getElementById(id);
			if (element) {
				element.innerHTML = html;
				console.log(`Inserted HTML into ${id}`);
				
				// Fix logo paths after loading components
				if (id === 'header') {
					fixLogoPath();
					// Initialize navbar immediately after header is loaded
					console.log('Header loaded, initializing navbar...');
					initializeNavbar();
				}
				if (id === 'footer') {
					fixFooterLogoPath();
				}
			} else {
				console.error(`Element with id '${id}' not found!`);
			}
		})
		.catch(error => {
			console.error(`Error loading component ${id}:`, error);
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

// Fix footer logo path based on current page location
function fixFooterLogoPath() {
	const footerLogoImg = document.getElementById('footer-logo-img');
	if (footerLogoImg) {
		const currentPath = window.location.pathname;
		const isInPagesFolder = currentPath.includes('/pages/');
		
		if (isInPagesFolder) {
			footerLogoImg.src = '../assets/images/ELT8.png';
		} else {
			footerLogoImg.src = 'assets/images/ELT8.png';
		}
	}
}

// Initialize simple navbar functionality
function initializeNavbar() {
	console.log('Initializing navbar...');
	const navToggle = document.getElementById('navToggle');
	const navLinks = document.getElementById('navLinks');
	const navOverlay = document.getElementById('navOverlay');
	const navLogo = document.querySelector('.nav-logo');
	
	// Check if elements exist
	if (!navToggle || !navLinks) {
		console.warn('Navbar elements not found, will retry...');
		return;
	}
	
	console.log('Navbar elements found:', { navToggle, navLinks, navOverlay });
	
	// Remove existing listeners to prevent duplicates
	const newNavToggle = navToggle.cloneNode(true);
	navToggle.parentNode.replaceChild(newNavToggle, navToggle);
	
	// Mobile menu toggle
	if (newNavToggle && navLinks) {
		// Toggle open/close
		newNavToggle.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			console.log('Nav toggle clicked!');
			
			const isOpen = navLinks.classList.toggle('open');
			newNavToggle.classList.toggle('active');
			document.body.classList.toggle('no-scroll', isOpen);
			newNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			if (navOverlay) navOverlay.classList.toggle('visible', isOpen);

			console.log('Menu is now:', isOpen ? 'OPEN' : 'CLOSED');

			if (isOpen) {
				const firstLink = navLinks.querySelector('a');
				firstLink?.focus();
			}
		});

		// Close on overlay click
		if (navOverlay) {
			navOverlay.addEventListener('click', () => {
				console.log('Overlay clicked, closing menu');
				navLinks.classList.remove('open');
				newNavToggle.classList.remove('active');
				document.body.classList.remove('no-scroll');
				newNavToggle.setAttribute('aria-expanded', 'false');
				navOverlay.classList.remove('visible');
			});
		}

		// Close mobile menu when clicking outside (fallback)
		document.addEventListener('click', function(e) {
			if (!newNavToggle.contains(e.target) && !navLinks.contains(e.target) && !navOverlay?.contains(e.target)) {
				if (navLinks.classList.contains('open')) {
					console.log('Clicked outside, closing menu');
					navLinks.classList.remove('open');
					newNavToggle.classList.remove('active');
					document.body.classList.remove('no-scroll');
					newNavToggle.setAttribute('aria-expanded', 'false');
					if (navOverlay) navOverlay.classList.remove('visible');
				}
			}
		});

		// Close on Escape key for accessibility
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				if (navLinks.classList.contains('open')) {
					console.log('Escape key pressed, closing menu');
					navLinks.classList.remove('open');
					newNavToggle.classList.remove('active');
					document.body.classList.remove('no-scroll');
					newNavToggle.setAttribute('aria-expanded', 'false');
					if (navOverlay) navOverlay.classList.remove('visible');
					newNavToggle.focus();
				}
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
	
	console.log('Navbar initialization complete!');
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
	
	// Check if server supports clean URLs (check for .htaccess or similar)
	// For now, use traditional .html URLs
	// In production with .htaccess, you can use: targetUrl = page === 'home' ? '/' : `/${page}`;
	
	window.location.href = targetUrl;
}

// Set active navigation item based on current page
function setActiveNavItem() {
	const currentPath = window.location.pathname;
	const navLinks = document.querySelectorAll('.nav-links a[data-page]');
	
	// Remove active class from all links
	navLinks.forEach(link => link.classList.remove('active'));
	
	// Determine current page - support both clean URLs and .html URLs
	let currentPage = 'home';
	if (currentPath.includes('sermons')) currentPage = 'sermons';
	else if (currentPath.includes('gallery')) currentPage = 'gallery';
	else if (currentPath.includes('announcements')) currentPage = 'announcements';
	else if (currentPath.includes('about')) currentPage = 'about';
	else if (currentPath.includes('contact')) currentPage = 'contact';
	
	// Set active class
	const activeLink = document.querySelector(`a[data-page="${currentPage}"]`);
	if (activeLink) {
		activeLink.classList.add('active');
	}
}

// Hero Content Rotation - Dynamic Message Screen
function initializeHeroTextRotation() {
	const heroTitle = document.getElementById('hero-title');
	const heroDescription = document.getElementById('hero-description');
	const heroButton = document.getElementById('hero-button');
	
	// Only run on home page
	if (!heroTitle || !heroDescription || !heroButton) return;
	
	const messages = [
		{
			title: "WELCOME TO EVENING LIGHT TABERNACLE",
			description: "Discover a place of worship, fellowship, and spiritual growth in our community",
			buttonText: "EXPLORE OUR CHURCH",
			buttonLink: "pages/about.html"
		},
		{
			title: "INSPIRING SERMONS & TEACHINGS",
			description: "Watch powerful messages from our pastor and dive deeper into God's word",
			buttonText: "WATCH LATEST SERMON",
			buttonLink: "pages/sermons.html"
		},
		{
			title: "JOIN US FOR WORSHIP",
			description: "Thursday at 5:00 PM • Sunday at 8:00 AM - All are welcome to join us!",
			buttonText: "VIEW SERVICE TIMES",
			buttonLink: "#service-times"
		},
		{
			title: "EXPLORE OUR COMMUNITY",
			description: "Browse through photos of our church activities, events, and fellowship moments",
			buttonText: "VIEW GALLERY",
			buttonLink: "pages/gallery.html"
		},
		{
			title: "STAY CONNECTED WITH US",
			description: "Get the latest updates, announcements, and events from our church community",
			buttonText: "SEE ANNOUNCEMENTS",
			buttonLink: "pages/announcements.html"
		}
	];
	
	let currentIndex = 0;
	
	function rotateContent() {
		// Fade out all elements
		heroTitle.classList.remove('fade-in');
		heroTitle.classList.add('fade-out');
		heroDescription.classList.remove('fade-in');
		heroDescription.classList.add('fade-out');
		heroButton.classList.remove('fade-in');
		heroButton.classList.add('fade-out');
		
		// Change content after fade out
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % messages.length;
			const currentMessage = messages[currentIndex];
			
			heroTitle.textContent = currentMessage.title;
			heroDescription.textContent = currentMessage.description;
			heroButton.textContent = currentMessage.buttonText;
			heroButton.href = currentMessage.buttonLink;
			
			// Fade in all elements
			heroTitle.classList.remove('fade-out');
			heroTitle.classList.add('fade-in');
			heroDescription.classList.remove('fade-out');
			heroDescription.classList.add('fade-in');
			heroButton.classList.remove('fade-out');
			heroButton.classList.add('fade-in');
		}, 500);
	}
	
	// Initial fade in
	heroTitle.classList.add('fade-in');
	heroDescription.classList.add('fade-in');
	heroButton.classList.add('fade-in');
	
	// Rotate every 5 seconds (giving users time to read)
	setInterval(rotateContent, 5000);
}

// ==========================================
// DATA LOADING FUNCTIONS (JSON-based)
// ==========================================

// Load Home Page Content (Latest Sermon)
// Load Home Page Content - Try Supabase first, fallback to JSON
async function loadHomePageContent() {
	let sermonLoaded = false;
	
	try {
		// Try loading from Supabase
		const { data, error } = await supabase
			.from('sermons')
			.select('*')
			.order('date', { ascending: false })
			.limit(1);
		
		if (!error && data && data.length > 0) {
			displayLatestSermon(data[0], true); // true = from Supabase
			sermonLoaded = true;
			console.log('Latest sermon loaded from Supabase');
		}
	} catch (error) {
		console.log('Supabase not available for sermons, will use local data:', error);
	}
	
	// Fallback to local JSON for sermon if Supabase failed or returned no data
	if (!sermonLoaded) {
		const currentPath = window.location.pathname;
		const isInPagesFolder = currentPath.includes('/pages/');
		const dataPath = isInPagesFolder ? '../data/sermons.json' : 'data/sermons.json';
		
		try {
			const response = await fetch(dataPath);
			const data = await response.json();
			if (data.sermons && data.sermons.length > 0) {
				displayLatestSermon(data.sermons[0], false); // false = from JSON
				console.log('Latest sermon loaded from local JSON');
			}
		} catch (error) {
			console.log('Error loading sermon data:', error);
		}
	}
	
	// Also load gallery preview
	await loadHomeGalleryPreview();
}

// Display Latest Sermon on Home Page
function displayLatestSermon(sermon, fromSupabase = false) {
	const sermonCard = document.querySelector('.latest-sermon .sermon-card');
	if (!sermonCard) {
		console.warn('Sermon card container not found');
		return;
	}
	
	// Handle different field names between Supabase and JSON
	const videoUrl = fromSupabase ? sermon.video_url : sermon.videoUrl;
	const date = fromSupabase ? formatDate(sermon.date) : sermon.date;
	const pastor = sermon.pastor || 'Pastor';
	const title = sermon.title || 'Latest Sermon';
	const description = sermon.description || '';
	const scripture = sermon.scripture || '';
	
	const embedUrl = fromSupabase ? getYouTubeEmbedUrl(videoUrl) : extractYouTubeEmbedUrl(videoUrl);
	
	if (embedUrl) {
		// Display video sermon
		sermonCard.innerHTML = `
			<div class="sermon-video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px;">
				<iframe 
					width="100%" 
					height="100%" 
					src="${embedUrl}" 
					frameborder="0" 
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
					allowfullscreen
					style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 10px;"
					loading="lazy">
				</iframe>
			</div>
			<div class="sermon-info">
				<h3>${title}</h3>
				<p style="color: var(--accent-gold); margin: 0.5rem 0;">
					<i class="fas fa-user"></i> ${pastor} | <i class="fas fa-calendar"></i> ${date}
				</p>
				${scripture ? `<p style="color: var(--text-light); margin: 0.5rem 0;"><i class="fas fa-book"></i> ${scripture}</p>` : ''}
				${description ? `<p style="margin-top: 1rem;">${description}</p>` : ''}
				<a href="pages/sermons.html" class="btn" style="margin-top: 1rem;">VIEW ALL SERMONS</a>
			</div>
		`;
	} else {
		// No video URL - show placeholder with info
		sermonCard.innerHTML = `
			<img src="assets/images/placeholder.png" alt="${title}" loading="lazy" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
			<div class="sermon-info">
				<h3>${title}</h3>
				<p style="color: var(--accent-gold); margin: 0.5rem 0;">
					<i class="fas fa-user"></i> ${pastor} | <i class="fas fa-calendar"></i> ${date}
				</p>
				${scripture ? `<p style="color: var(--text-light); margin: 0.5rem 0;"><i class="fas fa-book"></i> ${scripture}</p>` : ''}
				${description ? `<p style="margin-top: 1rem;">${description}</p>` : ''}
				<a href="pages/sermons.html" class="btn" style="margin-top: 1rem;">VIEW ALL SERMONS</a>
			</div>
		`;
	}
	
	console.log('Displayed sermon:', title);
}

// Helper to extract YouTube embed URL from JSON data
function extractYouTubeEmbedUrl(url) {
	const videoId = extractYouTubeId(url);
	return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

// Load Sermons Page - Try Supabase first, fallback to JSON
async function loadSermonsPage() {
	const sermonsContainer = document.querySelector('.sermons-grid');
	if (!sermonsContainer) return;
	
	sermonsContainer.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #667eea;"></i><p>Loading sermons...</p></div>';
	
	try {
		// Try Supabase first
		const { data, error } = await supabase
			.from('sermons')
			.select('*')
			.order('date', { ascending: false });
		
		if (!error && data && data.length > 0) {
			displaySermons(data, true); // true = from Supabase
			return;
		}
	} catch (error) {
		console.log('Supabase not available, using local data');
	}
	
	// Fallback to JSON
	fetch('../data/sermons.json')
		.then(response => response.json())
		.then(data => {
			if (!data.sermons || data.sermons.length === 0) {
				sermonsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #7f8c8d;"><p>No sermons available yet. Check back soon!</p></div>';
				return;
			}
			displaySermons(data.sermons, false); // false = from JSON
		})
		.catch(error => {
			console.log('Error loading sermons:', error);
			sermonsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #e74c3c;"><p>Error loading sermons. Please try again later.</p></div>';
		});
}

// Display sermons in grid
function displaySermons(sermons, fromSupabase = false) {
	const sermonsContainer = document.querySelector('.sermons-grid');
	if (!sermonsContainer) return;
	
	sermonsContainer.innerHTML = '';
	
	sermons.forEach(sermon => {
		const videoUrl = fromSupabase ? sermon.video_url : sermon.videoUrl;
		const date = fromSupabase ? formatDate(sermon.date) : sermon.date;
		const embedUrl = fromSupabase ? getYouTubeEmbedUrl(videoUrl) : extractYouTubeEmbedUrl(videoUrl);
		
		const sermonCard = document.createElement('div');
		sermonCard.className = 'sermon-card';
		sermonCard.innerHTML = `
			${embedUrl ? `
			<iframe 
				width="100%" 
				height="250" 
				src="${embedUrl}" 
				frameborder="0" 
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
				allowfullscreen
				style="border-radius: 10px 10px 0 0;">
			</iframe>
			` : ''}
			<div class="sermon-info">
				<h3>${sermon.title}</h3>
				<p><i class="fas fa-user"></i> ${sermon.pastor}</p>
				<p><i class="fas fa-calendar"></i> ${date}</p>
				${sermon.scripture ? `<p><i class="fas fa-book"></i> ${sermon.scripture}</p>` : ''}
				${sermon.description ? `<p style="margin-top: 10px;">${sermon.description}</p>` : ''}
			</div>
		`;
		sermonsContainer.appendChild(sermonCard);
	});
}

// Load Announcements Page - Try Supabase first, fallback to JSON
async function loadAnnouncementsPage() {
	const announcementsContainer = document.querySelector('.announcements-list');
	if (!announcementsContainer) return;
	
	announcementsContainer.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #667eea;"></i><p>Loading announcements...</p></div>';
	
	try {
		// Try Supabase first
		const { data, error } = await supabase
			.from('announcements')
			.select('*')
			.order('date', { ascending: false });
		
		if (!error && data && data.length > 0) {
			displayAnnouncements(data, true); // true = from Supabase
			return;
		}
	} catch (error) {
		console.log('Supabase not available, using local data');
	}
	
	// Fallback to JSON
	fetch('../data/announcements.json')
		.then(response => response.json())
		.then(data => {
			if (!data.announcements || data.announcements.length === 0) {
				announcementsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #7f8c8d;"><p>No announcements available yet. Check back soon!</p></div>';
				return;
			}
			displayAnnouncements(data.announcements, false); // false = from JSON
		})
		.catch(error => {
			console.log('Error loading announcements:', error);
			announcementsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #e74c3c;"><p>Error loading announcements. Please try again later.</p></div>';
		});
}

// Display announcements in list
function displayAnnouncements(announcements, fromSupabase = false) {
	const announcementsContainer = document.querySelector('.announcements-list');
	if (!announcementsContainer) return;
	
	announcementsContainer.innerHTML = '';
	
	announcements.forEach((announcement, index) => {
		const date = fromSupabase ? formatDate(announcement.date) : announcement.date;
		
		// Build links text if available
		const links = [];
		if (announcement.whatsapp_link) {
			links.push(`<a href="${announcement.whatsapp_link}" target="_blank">WhatsApp</a>`);
		}
		if (announcement.web_link) {
			links.push(`<a href="${announcement.web_link}" target="_blank">Website</a>`);
		}
		if (announcement.phone_link) {
			const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
			links.push(`<a href="${tel}">Call</a>`);
		}
		if (announcement.email_link) {
			const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
			links.push(`<a href="${mailto}">Email</a>`);
		}
		
		const listItem = document.createElement('li');
		
		listItem.innerHTML = `
			<strong>${announcement.title}</strong> <span class="announcement-date">(${date})</span>
			<p>${announcement.text}</p>
			${links.length > 0 ? `<div class="announcement-links">${links.join(' | ')}</div>` : ''}
		`;
		announcementsContainer.appendChild(listItem);
	});
}

// Load Gallery Page
async function loadGalleryPage() {
	const galleryContainer = document.querySelector('.gallery-grid.full-gallery');
	if (!galleryContainer) {
		console.warn('Gallery container not found');
		return;
	}
	
	// Clear existing placeholder content
	galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">Loading photos...</p>';
	
	try {
		// Try to load from Supabase
		const result = await getGalleryPhotos();
		
		if (result.success && result.data && result.data.length > 0) {
			// Clear loading message
			galleryContainer.innerHTML = '';
			
			// Add photos from Supabase
			result.data.forEach((photo, index) => {
				const galleryItem = document.createElement('div');
				galleryItem.className = 'gallery-item';
				galleryItem.style.animationDelay = `${index * 0.05}s`;
				galleryItem.setAttribute('data-index', index);
				galleryItem.innerHTML = `
					<img src="${photo.image_url}" alt="${photo.caption || 'Church Photo'}" loading="lazy">
					${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
				`;
				
				// Add click event to open lightbox
				galleryItem.addEventListener('click', () => openLightbox(index, result.data));
				
				galleryContainer.appendChild(galleryItem);
			});
			
			console.log(`Loaded ${result.data.length} photos from Supabase`);
		} else {
			// No photos found
			galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No photos available yet. Check back soon!</p>';
			console.log('No photos found in gallery');
		}
	} catch (error) {
		console.error('Error loading gallery:', error);
		galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e74c3c; padding: 20px;">Error loading photos. Please try again later.</p>';
	}
}

// Load Gallery Preview on Home Page (4 most recent photos)
async function loadHomeGalleryPreview() {
	const galleryContainer = document.querySelector('#homeGalleryPreview');
	if (!galleryContainer) {
		console.warn('Home gallery preview container not found');
		return;
	}
	
	try {
		// Try to load from Supabase
		const result = await getGalleryPhotos();
		
		if (result.success && result.data && result.data.length > 0) {
			// Clear existing placeholder
			galleryContainer.innerHTML = '';
			
			// Get first 4 photos (most recent)
			const photosToShow = Math.min(4, result.data.length);
			const photos = result.data.slice(0, photosToShow);
			
			// Add each photo once
			photos.forEach((photo, index) => {
				const galleryItem = document.createElement('div');
				galleryItem.className = `gallery-item animate-delay-${index + 1}`;
				galleryItem.setAttribute('data-index', index);
				galleryItem.innerHTML = `
					<img src="${photo.image_url}" alt="${photo.caption || 'Church Photo'}" loading="lazy">
					${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
				`;
				
				// Add click event to open lightbox
				galleryItem.addEventListener('click', () => openLightbox(index, result.data));
				
				galleryContainer.appendChild(galleryItem);
			});
			
			console.log(`Loaded ${photos.length} preview photos on home page`);
		} else {
			// No photos - show message
			galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">No photos available yet.</div>';
			console.log('No photos found for home page preview');
		}
	} catch (error) {
		console.error('Error loading gallery preview:', error);
		galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #e74c3c; padding: 20px;">Error loading photos.</div>';
	}
}

// Helper function to extract YouTube ID
function extractYouTubeId(url) {
	if (!url) return null;
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return (match && match[2].length === 11) ? match[2] : null;
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================

let lightboxData = {
	photos: [],
	currentIndex: 0,
	overlay: null
};

// Create lightbox overlay element
function createLightboxOverlay() {
	const overlay = document.createElement('div');
	overlay.className = 'lightbox-overlay';
	overlay.innerHTML = `
		<div class="lightbox-container">
			<div class="lightbox-loading"></div>
			<img class="lightbox-image" src="" alt="" style="display: none;">
			<div class="lightbox-caption"></div>
			<button class="lightbox-close" aria-label="Close lightbox">
				<i class="fas fa-times"></i>
			</button>
			<button class="lightbox-nav lightbox-prev" aria-label="Previous image">
				<i class="fas fa-chevron-left"></i>
			</button>
			<button class="lightbox-nav lightbox-next" aria-label="Next image">
				<i class="fas fa-chevron-right"></i>
			</button>
			<div class="lightbox-counter"></div>
		</div>
	`;
	
	document.body.appendChild(overlay);
	return overlay;
}

// Open lightbox
function openLightbox(index, photos) {
	// Store data
	lightboxData.photos = photos;
	lightboxData.currentIndex = index;
	
	// Create or get overlay
	if (!lightboxData.overlay) {
		lightboxData.overlay = createLightboxOverlay();
		setupLightboxEvents();
	}
	
	// Show overlay
	lightboxData.overlay.classList.add('active');
	document.body.style.overflow = 'hidden';
	
	// Load image
	showLightboxImage(index);
}

// Close lightbox
function closeLightbox() {
	if (lightboxData.overlay) {
		lightboxData.overlay.classList.remove('active');
		document.body.style.overflow = '';
	}
}

// Show image in lightbox
function showLightboxImage(index) {
	if (!lightboxData.overlay || !lightboxData.photos.length) return;
	
	const photo = lightboxData.photos[index];
	const img = lightboxData.overlay.querySelector('.lightbox-image');
	const caption = lightboxData.overlay.querySelector('.lightbox-caption');
	const counter = lightboxData.overlay.querySelector('.lightbox-counter');
	const loading = lightboxData.overlay.querySelector('.lightbox-loading');
	const prevBtn = lightboxData.overlay.querySelector('.lightbox-prev');
	const nextBtn = lightboxData.overlay.querySelector('.lightbox-next');
	
	// Show loading
	loading.style.display = 'block';
	img.style.display = 'none';
	
	// Update counter
	counter.textContent = `${index + 1} / ${lightboxData.photos.length}`;
	
	// Update caption
	if (photo.caption) {
		caption.textContent = photo.caption;
		caption.style.display = 'block';
	} else {
		caption.style.display = 'none';
	}
	
	// Load image
	const tempImg = new Image();
	tempImg.onload = () => {
		img.src = photo.image_url;
		img.alt = photo.caption || 'Church Photo';
		loading.style.display = 'none';
		img.style.display = 'block';
	};
	tempImg.onerror = () => {
		loading.style.display = 'none';
		caption.textContent = 'Error loading image';
		caption.style.display = 'block';
	};
	tempImg.src = photo.image_url;
	
	// Update navigation buttons
	prevBtn.style.display = lightboxData.photos.length > 1 ? 'flex' : 'none';
	nextBtn.style.display = lightboxData.photos.length > 1 ? 'flex' : 'none';
}

// Navigate to previous image
function showPreviousImage() {
	lightboxData.currentIndex = (lightboxData.currentIndex - 1 + lightboxData.photos.length) % lightboxData.photos.length;
	showLightboxImage(lightboxData.currentIndex);
}

// Navigate to next image
function showNextImage() {
	lightboxData.currentIndex = (lightboxData.currentIndex + 1) % lightboxData.photos.length;
	showLightboxImage(lightboxData.currentIndex);
}

// Setup lightbox event listeners
function setupLightboxEvents() {
	if (!lightboxData.overlay) return;
	
	const closeBtn = lightboxData.overlay.querySelector('.lightbox-close');
	const prevBtn = lightboxData.overlay.querySelector('.lightbox-prev');
	const nextBtn = lightboxData.overlay.querySelector('.lightbox-next');
	
	// Close button
	closeBtn.addEventListener('click', closeLightbox);
	
	// Navigation buttons
	prevBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		showPreviousImage();
	});
	
	nextBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		showNextImage();
	});
	
	// Click overlay to close
	lightboxData.overlay.addEventListener('click', (e) => {
		if (e.target === lightboxData.overlay) {
			closeLightbox();
		}
	});
	
	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (!lightboxData.overlay.classList.contains('active')) return;
		
		switch(e.key) {
			case 'Escape':
				closeLightbox();
				break;
			case 'ArrowLeft':
				showPreviousImage();
				break;
			case 'ArrowRight':
				showNextImage();
				break;
		}
	});
	
	// Touch swipe support
	let touchStartX = 0;
	let touchEndX = 0;
	
	lightboxData.overlay.addEventListener('touchstart', (e) => {
		touchStartX = e.changedTouches[0].screenX;
	}, { passive: true });
	
	lightboxData.overlay.addEventListener('touchend', (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}, { passive: true });
	
	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;
		
		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swipe left - show next
				showNextImage();
			} else {
				// Swipe right - show previous
				showPreviousImage();
			}
		}
	}
}

