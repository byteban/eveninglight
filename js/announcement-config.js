// Announcement Configuration
const announcementConfig = {
	// Set to true to show announcements, false to hide
	showAnnouncement: true,
	
	// Latest announcement details
	latestAnnouncement: {
		title: "Special Thanksgiving Service",
		text: "Join us for a special Thanksgiving service on November 28, 2025 at 10:00 AM. Followed by a potluck lunch!"
	}
};

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = announcementConfig;
}
