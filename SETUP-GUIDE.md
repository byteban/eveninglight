# 🚀 Quick Setup Guide

## Welcome to Eternal Life Tabernacle Website!

This guide will help you get your church website up and running in minutes.

## ✅ What's Already Done

Your website is **100% ready to use** with:
- ✓ Beautiful blue, white, and golden yellow theme
- ✓ Fully responsive design (mobile, tablet, desktop)
- ✓ 6 complete pages (Home, Sermons, Gallery, Announcements, About, Contact)
- ✓ Mobile-friendly navigation menu
- ✓ Gallery with lightbox viewer
- ✓ Professional styling and animations

## 📂 Your Logos

The website is configured to use two logos:
- **ELT4.png** - Primary logo (used in header)
- **ELT5.png** - Secondary logo (used in footer)

These should be placed in: `src/assets/images/`

## 🌐 View Your Website

### Option 1: Simple (No Installation)
1. Navigate to the `src` folder
2. Double-click `index.html`
3. Your website opens in your default browser!

### Option 2: Local Development Server (Recommended)
1. Install Node.js from https://nodejs.org (if not already installed)
2. Open PowerShell in the project folder
3. Run: `npm install`
4. Run: `npm start`
5. Your website opens at http://localhost:8080

## 🎨 Customize Your Website

### 1. Update Church Information

**Search and Replace** these terms across all files:
- "Eternal Life Tabernacle" → Your church name
- "info@eltchurch.com" → Your email
- "(555) 123-4567" → Your phone number
- "456 Faith Avenue, Hope City, ST 12345" → Your address

### 2. Update Service Times
Edit `src/pages/contact.html`:
```html
<p>Sunday Worship: 10:00 AM<br>
Wednesday Bible Study: 6:30 PM<br>
Friday Prayer: 7:00 PM</p>
```

### 3. Change Theme Colors
Edit `src/css/styles.css` (lines 5-12):
```css
:root {
    --primary-blue: #1e3a8a;      /* Change to your color */
    --golden-yellow: #fbbf24;     /* Change to your color */
    /* ... other colors */
}
```

### 4. Add Your Sermons
Edit `src/pages/sermons.html`:
1. Find a sermon-item div
2. Copy and paste it
3. Update:
   - Title
   - Date
   - Description
   - YouTube embed URL (get from YouTube → Share → Embed)

### 5. Add Your Photos
Edit `src/pages/gallery.html`:
1. Place photos in `src/assets/images/`
2. Add new gallery items:
```html
<div class="gallery-item">
    <img src="../assets/images/your-photo.jpg" alt="Event Name" onclick="openLightbox(this.src)">
</div>
```

### 6. Update Announcements
Edit `src/pages/announcements.html`:
```html
<div class="announcement">
    <h3>Your Event Title</h3>
    <p class="date">November 30, 2025</p>
    <p>Event description...</p>
</div>
```

### 7. Update About Page
Edit `src/pages/about.html`:
- Update church history
- Update leadership names and bios
- Update beliefs and mission statement

### 8. Google Maps Integration
Edit `src/pages/contact.html`:
1. Go to https://www.google.com/maps
2. Search for your church address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the existing iframe in contact.html

## 📱 Test on Mobile

1. Open the website in your browser
2. Press F12 to open Developer Tools
3. Click the mobile device icon (or press Ctrl+Shift+M)
4. Test different screen sizes

## 🚀 Deploy Your Website

### Option 1: GitHub Pages (Free!)
1. Create a GitHub account
2. Create a new repository
3. Upload all files from the `src` folder
4. Go to Settings → Pages
5. Select main branch
6. Your site is live!

### Option 2: Netlify (Free!)
1. Go to https://netlify.com
2. Drag and drop your `src` folder
3. Your site is live instantly!

### Option 3: Your Own Hosting
Upload all files from the `src` folder to your web hosting service.

## 📋 Pre-Launch Checklist

Before going live, check:
- [ ] All church information is updated
- [ ] Your logos are in place
- [ ] Contact information is correct
- [ ] Email addresses work
- [ ] Phone numbers are correct
- [ ] Address and map are accurate
- [ ] Social media links are updated
- [ ] All pages load correctly
- [ ] Mobile version looks good
- [ ] All links work

## 🆘 Common Issues

**Issue**: Images don't show
- **Fix**: Make sure image paths are correct (check the `src=` attribute)

**Issue**: Styles not loading
- **Fix**: Make sure `styles.css` is in the `css` folder

**Issue**: Navigation menu not working on mobile
- **Fix**: Make sure `main.js` is loaded at the bottom of each page

**Issue**: Videos not playing
- **Fix**: Use the YouTube embed URL, not the regular watch URL

## 📞 Need Help?

If you need assistance:
1. Check the main README.md for detailed documentation
2. Review the comments in the code files
3. Test in different browsers (Chrome, Firefox, Safari, Edge)

## 🎉 You're Ready!

Your church website is ready to go. Simply:
1. Add your content
2. Test everything
3. Deploy online
4. Share with your congregation!

---

**God Bless Your Ministry! 🙏**
