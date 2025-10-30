# Announcement System Guide

## Overview
The Evening Light Tabernacle website features a dynamic announcement system that displays the latest church announcement in different locations based on device type.

## Display Behavior

### Desktop (screens wider than 768px)
- Announcements appear in a **sidebar** on the right side of the page
- Sidebar is fixed and scrolls with the page
- Shows the full announcement title and description
- Includes a "View All" button linking to the announcements page

### Mobile (screens 768px and smaller)
- Announcements appear as a **banner** below the navigation bar
- Banner shows a shorter announcement text
- Can be dismissed by clicking the X button
- Slides down with animation when displayed

## How to Control Announcements

### Enable/Disable Announcements
Edit the file: `src/js/announcement-config.js`

```javascript
const announcementConfig = {
	// Set to true to show announcements, false to hide
	showAnnouncement: true,  // Change to false to hide all announcements
	
	// Latest announcement details
	latestAnnouncement: {
		title: "Your Announcement Title",
		text: "Your detailed announcement text here..."
	}
};
```

### Settings:

1. **`showAnnouncement: true`**
   - Displays the announcement on desktop sidebar and mobile banner
   
2. **`showAnnouncement: false`**
   - Hides all announcements on both desktop and mobile
   - No sidebar or banner will appear

### Update Announcement Content

To change the announcement being displayed:

1. Open `src/js/announcement-config.js`
2. Update the `latestAnnouncement` object:
   - `title`: Short title (shown on mobile banner and sidebar header)
   - `text`: Full description (shown only in desktop sidebar)

Example:
```javascript
latestAnnouncement: {
	title: "Christmas Concert - December 22nd",
	text: "Join us for our annual Christmas concert! The choir will perform traditional carols and special performances. Free admission, all are welcome. Refreshments will be served after the concert."
}
```

## Service Times

The homepage now displays church service times:
- **Thursday Service**: 5:00 PM (17:00)
- **Sunday Service**: 8:00 AM

To modify service times, edit `src/index.html` in the Service Times Section.

## Technical Details

### Files Modified:
1. `src/index.html` - Added announcement HTML elements and service times section
2. `src/css/styles.css` - Added styles for sidebar, banner, and service times
3. `src/js/main.js` - Added announcement initialization logic
4. `src/js/announcement-config.js` - Configuration file for announcement settings

### CSS Classes:
- `.announcement-sidebar` - Desktop sidebar container
- `.announcement-banner` - Mobile banner container
- `.service-times-section` - Service times display section

### JavaScript Functions:
- `initializeAnnouncements()` - Main initialization
- `showMobileBanner()` - Display mobile banner
- `showDesktopSidebar()` - Display desktop sidebar
- `closeAnnouncementBanner()` - Close mobile banner
- `closeAnnouncementSidebar()` - Close desktop sidebar

## Responsive Behavior

The system automatically switches between mobile and desktop views based on screen width (768px breakpoint). When the browser is resized, it will automatically show the appropriate announcement format.
