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
	
	// Try to fetch active announcement from backend
	const result = await getActiveAnnouncement();
	
	if (result.success && result.data) {
		// Only show if show_popup is true
		if (result.data.show_popup) {
			displayAnnouncement(result.data);
		}
	} else {
		// Fallback to local config if available
		if (typeof announcementConfig !== 'undefined' && announcementConfig.showAnnouncement) {
			const announcement = announcementConfig.latestAnnouncement;
			displayAnnouncement(announcement);
		}
	}
}

// Display announcement (works for both Firebase and local data)
function displayAnnouncement(announcement) {
	if (!announcement) return;
	
	const isMobile = window.innerWidth <= 768;
	
	if (isMobile) {
		showMobileBanner(announcement);
	} else {
		showDesktopSidebar(announcement);
	}
}

// Show Mobile Announcement Banner
function showMobileBanner(announcement) {
	// Check if user closed it in this session
	if (sessionStorage.getItem('announcementBannerClosed')) {
		return;
	}
	
	const banner = document.getElementById('announcement-banner');
	const bannerText = document.querySelector('.announcement-banner-text');
	
	if (banner && bannerText && announcement) {
		// Set the title as main text
		bannerText.innerHTML = `
			<strong>${announcement.title}</strong>
			${announcement.text ? `<br><span style="font-size: 0.85rem; font-weight: normal;">${announcement.text.substring(0, 100)}${announcement.text.length > 100 ? '...' : ''}</span>` : ''}
		`;
		
		// Add links if available
		const bannerContent = banner.querySelector('.announcement-banner-content');
		const existingLinks = bannerContent.querySelector('.mobile-announcement-links');
		if (existingLinks) existingLinks.remove();
		
		const links = [];
		if (announcement.whatsapp_link) {
			links.push(`<a href="${announcement.whatsapp_link}" target="_blank" class="mobile-announcement-link" title="WhatsApp">
				<i class="fab fa-whatsapp"></i>
			</a>`);
		}
		if (announcement.web_link) {
			links.push(`<a href="${announcement.web_link}" target="_blank" class="mobile-announcement-link" title="Website">
				<i class="fas fa-globe"></i>
			</a>`);
		}
		if (announcement.phone_link) {
			const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
			links.push(`<a href="${tel}" class="mobile-announcement-link" title="Call">
				<i class="fas fa-phone"></i>
			</a>`);
		}
		if (announcement.email_link) {
			const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
			links.push(`<a href="${mailto}" class="mobile-announcement-link" title="Email">
				<i class="fas fa-envelope"></i>
			</a>`);
		}
		
		if (links.length > 0) {
			const linksDiv = document.createElement('div');
			linksDiv.className = 'mobile-announcement-links';
			linksDiv.innerHTML = links.join('');
			// Insert before close button
			const closeBtn = bannerContent.querySelector('.announcement-banner-close');
			if (closeBtn) {
				closeBtn.parentNode.insertBefore(linksDiv, closeBtn);
			}
		}
		
		banner.style.display = 'block';
		document.body.classList.add('banner-visible');
	}
}

// Show Desktop Announcement Sidebar
function showDesktopSidebar(announcement) {
	// Check if user closed it in this session
	if (sessionStorage.getItem('announcementSidebarClosed')) {
		return;
	}
	
	const sidebar = document.getElementById('announcement-sidebar');
	const title = document.getElementById('sidebar-announcement-title');
	const text = document.getElementById('sidebar-announcement-text');
	
	if (sidebar && title && text && announcement) {
		title.textContent = announcement.title;
		text.textContent = announcement.text;
		
		// Add links if available
		const sidebarContent = sidebar.querySelector('.announcement-sidebar-content');
		const existingLinks = sidebarContent.querySelector('.announcement-links');
		if (existingLinks) existingLinks.remove();
		
		const links = [];
		if (announcement.whatsapp_link) {
			links.push(`<a href="${announcement.whatsapp_link}" target="_blank" class="announcement-link">
				<i class="fab fa-whatsapp"></i> WhatsApp
			</a>`);
		}
		if (announcement.web_link) {
			links.push(`<a href="${announcement.web_link}" target="_blank" class="announcement-link">
				<i class="fas fa-globe"></i> Visit Website
			</a>`);
		}
		if (announcement.phone_link) {
			const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
			links.push(`<a href="${tel}" class="announcement-link">
				<i class="fas fa-phone"></i> Call Us
			</a>`);
		}
		if (announcement.email_link) {
			const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
			links.push(`<a href="${mailto}" class="announcement-link">
				<i class="fas fa-envelope"></i> Email Us
			</a>`);
		}
		
		if (links.length > 0) {
			const linksDiv = document.createElement('div');
			linksDiv.className = 'announcement-links';
			linksDiv.innerHTML = links.join('');
			// Insert before "View All" button
			const viewAllBtn = sidebarContent.querySelector('.btn-small');
			if (viewAllBtn) {
				viewAllBtn.parentNode.insertBefore(linksDiv, viewAllBtn);
			} else {
				sidebarContent.appendChild(linksDiv);
			}
		}
		
		// Remove hidden class and show
		sidebar.classList.remove('hidden');
		sidebar.style.display = 'block';
		
		// Sidebar is fixed position - no layout adjustment needed
	}
}

// Close Mobile Banner
window.closeAnnouncementBanner = function() {
	const banner = document.getElementById('announcement-banner');
	if (banner) {
		banner.style.animation = 'slideUp 0.3s ease';
		setTimeout(() => {
			banner.style.display = 'none';
			document.body.classList.remove('banner-visible');
			banner.style.animation = '';
		}, 300);
		// Store in session so it stays closed during this visit
		sessionStorage.setItem('announcementBannerClosed', 'true');
	}
}

// Close Desktop Sidebar
window.closeAnnouncementSidebar = function() {
	const sidebar = document.getElementById('announcement-sidebar');
	if (sidebar) {
		sidebar.classList.add('hidden');
		// Store in session so it stays closed during this visit
		sessionStorage.setItem('announcementSidebarClosed', 'true');
	}
}

// Adjust content width for sidebar - REMOVED as sidebar is fixed position
function adjustContentForSidebar() {
	// No longer needed - sidebar is fixed and doesn't affect layout
}

// Reset content width - REMOVED as sidebar is fixed position
function resetContentWidth() {
	// No longer needed - sidebar is fixed and doesn't affect layout
}

// Handle window resize
// Handle window resize
window.addEventListener('resize', function() {
	const isHomePage = !window.location.pathname.includes('/pages/');
	
	if (isHomePage) {
		const isMobile = window.innerWidth <= 768;
		const banner = document.getElementById('announcement-banner');
		const sidebar = document.getElementById('announcement-sidebar');
		
		// Check if announcements are being shown (not closed by user)
		const bannerClosed = sessionStorage.getItem('announcementBannerClosed');
		const sidebarClosed = sessionStorage.getItem('announcementSidebarClosed');
		
		if (isMobile) {
			// Switch to mobile view
			if (sidebar) {
				sidebar.style.display = 'none';
			}
			// Only show banner if it wasn't closed and sidebar was visible
			if (banner && !bannerClosed && sidebar && !sidebarClosed) {
				banner.style.display = 'block';
				document.body.classList.add('banner-visible');
			}
		} else {
			// Switch to desktop view
			if (banner) {
				banner.style.display = 'none';
				document.body.classList.remove('banner-visible');
			}
			// Only show sidebar if it wasn't closed and it's not hidden
			if (sidebar && !sidebarClosed && !sidebar.classList.contains('hidden')) {
				sidebar.style.display = 'block';
			}
		}
	}
});

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
	try {
		// Try loading from Supabase
		const { data, error } = await supabase
			.from('sermons')
			.select('*')
			.order('date', { ascending: false })
			.limit(1);
		
		if (error) throw error;
		
		if (data && data.length > 0) {
			displayLatestSermon(data[0], true); // true = from Supabase
		}
	} catch (error) {
		console.log('Supabase not available, using local data:', error);
	}
	
	// Also load gallery preview
	await loadHomeGalleryPreview();
	
	// Fallback to local JSON for sermon if Supabase failed
	const currentPath = window.location.pathname;
	const isInPagesFolder = currentPath.includes('/pages/');
	const dataPath = isInPagesFolder ? '../data/sermons.json' : 'data/sermons.json';
	
	fetch(dataPath)
		.then(response => response.json())
		.then(data => {
			if (data.sermons && data.sermons.length > 0) {
				displayLatestSermon(data.sermons[0], false); // false = from JSON
			}
		})
		.catch(error => console.log('Error loading sermon data:', error));
}

// Display Latest Sermon on Home Page
function displayLatestSermon(sermon, fromSupabase = false) {
	const sermonCard = document.querySelector('.latest-sermon .sermon-card');
	if (!sermonCard) return;
	
	// Handle different field names between Supabase and JSON
	const videoUrl = fromSupabase ? sermon.video_url : sermon.videoUrl;
	const date = fromSupabase ? formatDate(sermon.date) : sermon.date;
	
	const embedUrl = fromSupabase ? getYouTubeEmbedUrl(videoUrl) : extractYouTubeEmbedUrl(videoUrl);
	
	if (embedUrl) {
		sermonCard.innerHTML = `
			<iframe 
				width="100%" 
				height="400" 
				src="${embedUrl}" 
				frameborder="0" 
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
				allowfullscreen
				style="border-radius: 10px;">
			</iframe>
			<div class="sermon-info">
				<h3>${sermon.title}</h3>
				<p><i class="fas fa-user"></i> ${sermon.pastor} | <i class="fas fa-calendar"></i> ${date}</p>
				${sermon.scripture ? `<p><i class="fas fa-book"></i> ${sermon.scripture}</p>` : ''}
				${sermon.description ? `<p>${sermon.description}</p>` : ''}
			</div>
		`;
	}
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
	
	announcements.forEach(announcement => {
		const date = fromSupabase ? formatDate(announcement.date) : announcement.date;
		
		// Build links HTML if available
		const links = [];
		if (announcement.whatsapp_link) {
			links.push(`<a href="${announcement.whatsapp_link}" target="_blank" class="announcement-action-link">
				<i class="fab fa-whatsapp"></i> Join WhatsApp Group
			</a>`);
		}
		if (announcement.web_link) {
			links.push(`<a href="${announcement.web_link}" target="_blank" class="announcement-action-link">
				<i class="fas fa-globe"></i> Visit Website
			</a>`);
		}
		if (announcement.phone_link) {
			const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
			links.push(`<a href="${tel}" class="announcement-action-link">
				<i class="fas fa-phone"></i> Call Us
			</a>`);
		}
		if (announcement.email_link) {
			const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
			links.push(`<a href="${mailto}" class="announcement-action-link">
				<i class="fas fa-envelope"></i> Email Us
			</a>`);
		}
		
		const announcementCard = document.createElement('div');
		announcementCard.className = 'announcement-card';
		if (announcement.priority === 'high') {
			announcementCard.classList.add('priority-high');
		}
		announcementCard.innerHTML = `
			<div class="announcement-header">
				<h3>${announcement.title}</h3>
				<span class="announcement-date"><i class="fas fa-calendar"></i> ${date}</span>
			</div>
			<div class="announcement-body">
				<p>${announcement.text}</p>
				${links.length > 0 ? `<div class="announcement-actions">${links.join('')}</div>` : ''}
			</div>
		`;
		announcementsContainer.appendChild(announcementCard);
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
			
			// Add photos from Supabase (NO DUPLICATES - just show all photos)
			result.data.forEach((photo, index) => {
				const galleryItem = document.createElement('div');
				galleryItem.className = 'gallery-item';
				galleryItem.style.animationDelay = `${index * 0.05}s`;
				galleryItem.innerHTML = `
					<img src="${photo.image_url}" alt="${photo.caption || 'Church Photo'}" loading="lazy">
					${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
				`;
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

// Load Gallery Preview on Home Page (4 most recent photos - NO DUPLICATES)
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
			
			// Get first 4 photos (most recent) - NO DUPLICATES
			const photosToShow = Math.min(4, result.data.length);
			const photos = result.data.slice(0, photosToShow);
			
			// Add each photo once
			photos.forEach((photo, index) => {
				const galleryItem = document.createElement('div');
				galleryItem.className = `gallery-item animate-delay-${index + 1}`;
				galleryItem.innerHTML = `
					<img src="${photo.image_url}" alt="${photo.caption || 'Church Photo'}" loading="lazy">
					${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
				`;
				galleryContainer.appendChild(galleryItem);
			});
			
			console.log(`Loaded ${photos.length} preview photos on home page (no duplicates)`);
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
