# Animations and Clean URLs Implementation Guide

## Overview
This document describes the animations and clean URL routing system implemented for the Evening Light Tabernacle website.

## 🎨 Animations Implemented

### 1. **Page Load Animations**
All pages now feature smooth entrance animations:
- Navbar slides down with fade-in effect
- Hero section fades in
- Content sections reveal on scroll

### 2. **Animation Classes Available**

#### CSS Animation Classes:
```css
.animate-fade-in        /* Fade in from transparent to visible */
.animate-slide-up       /* Slide up from bottom with fade */
.animate-slide-left     /* Slide in from left with fade */
.animate-slide-right    /* Slide in from right with fade */
.animate-scale-in       /* Scale up from small to normal */
.animate-fade-in-down   /* Fade in while moving down */
```

#### Delay Classes (for staggered animations):
```css
.animate-delay-1        /* 0.1s delay */
.animate-delay-2        /* 0.2s delay */
.animate-delay-3        /* 0.3s delay */
.animate-delay-4        /* 0.4s delay */
.animate-delay-5        /* 0.5s delay */
.animate-delay-6        /* 0.6s delay */
```

#### Scroll Reveal:
```css
.scroll-reveal          /* Elements fade and slide up when scrolling into view */
```

### 3. **Interactive Animations**

#### Buttons:
- Hover: Lift effect with scale and ripple
- Active: Press down effect
- Smooth color transitions

#### Cards (Service cards, Sermon cards, etc.):
- Hover: Lift up with enhanced shadow
- Scale effect on hover
- Smooth transitions

#### Gallery Items:
- Hover: Image zoom and overlay effect
- Smooth transform animations
- Shadow enhancement

#### Form Inputs:
- Focus: Lift effect with blue glow
- Hover: Golden border highlight
- Smooth transitions

#### Navigation:
- Link hover: Golden color with underline animation
- Logo hover: Subtle scale effect
- Mobile menu: Smooth slide-in

### 4. **Admin Dashboard Animations**
- Login card: Scale and slide-up entrance
- Header: Slide down with fade
- Buttons: Ripple effect on hover
- Form elements: Smooth focus effects

## 🔗 Clean URLs System

### Implementation Methods

#### Method 1: Apache Server (.htaccess)
The `.htaccess` file has been created with the following features:
- Removes `.html` extensions from URLs
- Redirects old URLs to clean URLs
- Enables compression
- Enables browser caching

**Clean URL Examples:**
```
https://yoursite.com/              (instead of index.html)
https://yoursite.com/sermons       (instead of pages/sermons.html)
https://yoursite.com/gallery       (instead of pages/gallery.html)
https://yoursite.com/announcements (instead of pages/announcements.html)
https://yoursite.com/about         (instead of pages/about.html)
https://yoursite.com/contact       (instead of pages/contact.html)
https://yoursite.com/admin/login   (instead of admin/login.html)
```

#### Method 2: JavaScript Routing (Development)
For development or servers without .htaccess support:
- The routing system in `main.js` handles navigation
- Uses History API for clean URLs
- Fallback to traditional .html URLs

### Testing Clean URLs

#### On Apache Server:
1. Upload all files including `.htaccess`
2. Ensure mod_rewrite is enabled
3. Test URLs without .html extension

#### On Development Server:
1. URLs will use .html extensions
2. Navigation still works smoothly
3. Can be tested with Live Server in VS Code

### Enabling Clean URLs in Production

To enable clean URLs on your production server:

1. **Apache**: Ensure `.htaccess` file is uploaded
2. **Nginx**: Add rewrite rules to nginx config:
```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}
```

3. **Netlify/Vercel**: Add `_redirects` or `vercel.json` configuration

## 📝 Usage Examples

### Adding Animations to New Elements

#### HTML:
```html
<!-- Fade in on load -->
<div class="animate-on-load animate-fade-in">
    <h2>Welcome</h2>
</div>

<!-- Scroll reveal sections -->
<section class="scroll-reveal">
    <h2>Our Services</h2>
    <!-- Content -->
</section>

<!-- Staggered card animations -->
<div class="card-container">
    <div class="card animate-delay-1">Card 1</div>
    <div class="card animate-delay-2">Card 2</div>
    <div class="card animate-delay-3">Card 3</div>
</div>
```

#### JavaScript:
The scroll reveal animations are automatically initialized by `initPageAnimations()` in `main.js`.

### Creating Custom Animations

Add to `styles.css`:
```css
@keyframes yourAnimation {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.your-class {
    animation: yourAnimation 0.8s ease-out;
}
```

## 🎯 Animation Best Practices

1. **Keep it subtle**: Animations should enhance, not distract
2. **Performance**: Use `transform` and `opacity` for smooth 60fps
3. **Duration**: Most animations between 0.3s - 0.8s
4. **Easing**: Use `ease-out` for entrance, `ease-in` for exit
5. **Accessibility**: Respect `prefers-reduced-motion` user settings

### Adding Reduced Motion Support:
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## 🚀 Performance Optimizations

1. **Hardware Acceleration**: Animations use `transform` and `opacity`
2. **Lazy Loading**: Images load as needed
3. **Code Splitting**: JavaScript loads module by module
4. **Caching**: Browser caching enabled via .htaccess
5. **Compression**: GZIP compression for text assets

## 🔧 Troubleshooting

### Animations Not Working?
1. Check if JavaScript is enabled
2. Verify CSS file is loaded
3. Check browser console for errors
4. Ensure `initPageAnimations()` is called

### Clean URLs Not Working?
1. **Apache**: Check if mod_rewrite is enabled
2. **Local**: Use a proper development server (not just file://)
3. **Netlify/Vercel**: Check platform-specific configuration
4. Verify .htaccess file is uploaded and readable

### Scroll Animations Not Triggering?
1. Check if elements have `.scroll-reveal` class
2. Verify IntersectionObserver is supported (all modern browsers)
3. Check if JavaScript is loaded properly

## 📦 Files Modified

### CSS Files:
- `src/css/styles.css` - Main animations and styles
- `src/css/admin.css` - Admin dashboard animations

### JavaScript Files:
- `src/js/main.js` - Routing and animation initialization

### HTML Files (Animation classes added):
- `src/index.html`
- `src/pages/gallery.html`
- `src/pages/sermons.html`
- `src/pages/announcements.html`
- `src/pages/about.html`
- `src/pages/contact.html`

### New Files:
- `src/.htaccess` - Apache rewrite rules for clean URLs

## 🎨 Animation Timeline

Page Load:
1. **0ms**: Navbar slides down (fadeInDown)
2. **100ms**: Hero section fades in
3. **200ms**: Components load
4. **300ms+**: Content sections fade in as user scrolls

## 📱 Mobile Considerations

All animations are:
- Optimized for mobile performance
- Touch-friendly (no hover-only interactions)
- Responsive to screen size
- Tested on iOS and Android

## 🌐 Browser Support

Animations work on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Additional Resources

- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Tricks - Animation Guide](https://css-tricks.com/almanac/properties/a/animation/)
- [Apache mod_rewrite Documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)

---

**Last Updated**: October 30, 2025
**Version**: 2.0
