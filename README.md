# Eternal Life Tabernacle - Church Website

A beautiful, modern, and responsive website for Eternal Life Tabernacle, featuring a clean design with blue, white, and golden yellow theme colors.

## 🌟 Features

- **Modern Design**: Professional layout with a blue, white, and golden yellow color scheme
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Home Page**: Welcome section with mission statement, latest sermon highlights, and upcoming events
- **Weekly Sermons**: Dedicated page for sermon videos with descriptions and dates
- **Photo Gallery**: Responsive grid layout with lightbox viewer for church event photos
- **Announcements**: Up-to-date church news and event information
- **About Us**: Church history, beliefs, and leadership information
- **Contact Page**: Church location, contact details, service times, and Google Maps integration
- **Mobile Menu**: Touch-friendly navigation for mobile devices
- **Smooth Animations**: Professional transitions and hover effects

## 📁 Project Structure

```
church-website/
├── src/
│   ├── index.html              # Home page
│   ├── assets/
│   │   └── images/
│   │       ├── ELT4.png        # Primary logo
│   │       └── ELT5.png        # Secondary logo
│   ├── css/
│   │   └── styles.css          # Main stylesheet with theme colors
│   ├── js/
│   │   └── main.js             # JavaScript for interactions
│   ├── pages/
│   │   ├── sermons.html        # Weekly sermons page
│   │   ├── gallery.html        # Photo gallery page
│   │   ├── announcements.html  # Church announcements
│   │   ├── about.html          # About the church
│   │   └── contact.html        # Contact information
│   ├── components/
│   │   ├── header.html         # Reusable header component
│   │   └── footer.html         # Reusable footer component
│   └── data/
│       ├── announcements.json  # Announcements data (for future use)
│       └── sermons.json        # Sermons data (for future use)
├── package.json
└── README.md
```

## 🎨 Theme Colors

- **Primary Blue**: #1e3a8a
- **Secondary Blue**: #3b82f6
- **Light Blue**: #dbeafe
- **White**: #ffffff
- **Golden Yellow**: #fbbf24
- **Dark Gold**: #d97706

## 🚀 Getting Started

### Quick Start
1. Clone or download this repository
2. Navigate to the `src` folder
3. Open `index.html` in your web browser
4. Explore the website!

### Development
1. Edit HTML files in `src/` and `src/pages/`
2. Modify styles in `src/css/styles.css`
3. Update JavaScript in `src/js/main.js`
4. Replace placeholder logos with your church logos in `src/assets/images/`

## 📱 Pages Overview

### Home (index.html)
- Hero section with church name and tagline
- Mission statement
- Latest sermon highlight
- Upcoming announcements preview
- Full navigation

### Sermons (pages/sermons.html)
- Grid layout of sermon videos
- Embedded YouTube videos
- Sermon titles, dates, and descriptions
- Responsive design for all devices

### Gallery (pages/gallery.html)
- Responsive photo grid
- Lightbox viewer for full-size images
- Sample images from church events
- Click any image to view larger

### Announcements (pages/announcements.html)
- List of church events and news
- Dates and detailed descriptions
- Easy to update and maintain

### About Us (pages/about.html)
- Church vision and history
- Core beliefs and values
- Leadership team information
- Call to action for visitors

### Contact (pages/contact.html)
- Church address and phone number
- Email links
- Service times
- Office hours
- Embedded Google Map
- First-time visitor information

## 💡 Features & Functionality

### JavaScript Features
- **Mobile Menu Toggle**: Responsive hamburger menu for mobile devices
- **Lightbox Gallery**: Click images to view full-size with smooth animations
- **Smooth Scrolling**: Elegant page navigation
- **Active Link Highlighting**: Current page highlighted in navigation

### CSS Features
- **CSS Variables**: Easy theme customization
- **Flexbox & Grid**: Modern, flexible layouts
- **Media Queries**: Responsive design for all screen sizes
- **Transitions**: Smooth hover effects and animations
- **Box Shadows**: Professional depth and elevation

## 🔧 Customization

### Update Church Information
1. **Church Name**: Edit in all HTML files (search for "Eternal Life Tabernacle")
2. **Contact Info**: Update in `footer.html` and `contact.html`
3. **Logos**: Replace `ELT4.png` and `ELT5.png` in `assets/images/`

### Add New Sermons
1. Open `pages/sermons.html`
2. Copy an existing sermon-item div
3. Update title, date, description, and video URL

### Add Gallery Photos
1. Open `pages/gallery.html`
2. Copy a gallery-item div
3. Update the image src and alt text

### Update Announcements
1. Open `pages/announcements.html`
2. Copy an announcement div
3. Update title, date, and description

## 🌐 Future Enhancements

The website is ready for these future additions:
- **Firebase Integration**: Dynamic content management
- **Admin Dashboard**: Upload sermons and announcements online
- **Contact Form**: Email submissions from the website
- **Event Calendar**: Interactive calendar for church events
- **Live Streaming**: Embed live service streams
- **Member Portal**: Login area for church members
- **PWA Features**: Mobile app-like experience

## 📊 JSON Data Structure

Sample data files are included in `src/data/` for future dynamic loading:
- `announcements.json`: Structured announcement data
- `sermons.json`: Structured sermon data with metadata

These can be used with JavaScript to load content dynamically or integrated with a backend service like Firebase.

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6)**: Interactive features
- **Responsive Design**: Mobile-first approach
- **Font**: Segoe UI system font family

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Support

For questions or issues with the website, please contact:
- Email: info@eltchurch.com
- Phone: (555) 123-4567

## 📄 License

This project is open-source and available for church use. Feel free to customize and adapt for your congregation.

---

**Built with ❤️ for Eternal Life Tabernacle**