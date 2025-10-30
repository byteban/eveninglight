# Performance Optimization Guide

This document outlines the performance optimizations implemented and recommendations for the Evening Light Tabernacle website.

## ✅ Implemented Optimizations

### 1. **Hero Section Mobile Optimization**
- ✅ Responsive background image positioning
- ✅ Removed `background-attachment: fixed` on mobile (causes performance issues)
- ✅ Adaptive text sizing with `clamp()` for better readability
- ✅ Optimized overlay darkness for better text contrast on mobile
- ✅ Reduced letter-spacing on smaller screens for better fit

### 2. **Lazy Loading**
- ✅ Added `loading="lazy"` to all below-the-fold images
- ✅ Gallery images load only when scrolled into view
- ✅ Sermon thumbnails lazy-loaded

### 3. **Resource Preloading**
- ✅ Preload critical CSS files
- ✅ Preload hero image for faster initial render
- ✅ DNS prefetch for external resources (CDNs, Google Fonts)

### 4. **Footer Optimization**
- ✅ Reduced number of links (removed Gallery from quick links)
- ✅ Combined contact info with service times
- ✅ Better mobile layout with improved spacing
- ✅ Cleaner visual hierarchy

## 🎯 Image Optimization Recommendations

### Current Images to Optimize

1. **Hero Image** (`assets/images/hero.png`)
   - Recommended: Convert to WebP format
   - Target size: < 200KB
   - Dimensions: 1920x1080px (optimize for multiple breakpoints)

2. **Gallery Images** (`assets/images/placeholder.png`)
   - Recommended: WebP format with JPEG fallback
   - Target size: < 150KB each
   - Use responsive images with `srcset`

3. **Logo Images** (`ELT4.png`, `ELT8.png`)
   - Recommended: SVG format if possible, or optimized PNG
   - Target size: < 50KB

### How to Optimize Images

#### Using Online Tools:
- **TinyPNG**: https://tinypng.com/ (PNG/JPEG compression)
- **Squoosh**: https://squoosh.app/ (WebP conversion)
- **CloudConvert**: https://cloudconvert.com/ (Batch conversion)

#### Using Command Line (ImageMagick):
```bash
# Convert to WebP
magick hero.png -quality 85 hero.webp

# Resize and optimize
magick hero.png -resize 1920x1080 -quality 85 hero-optimized.jpg
```

#### Responsive Images Example:
```html
<picture>
  <source 
    srcset="assets/images/hero-mobile.webp 480w,
            assets/images/hero-tablet.webp 768w,
            assets/images/hero-desktop.webp 1920w"
    type="image/webp">
  <img src="assets/images/hero.jpg" 
       alt="Hero Image" 
       loading="eager">
</picture>
```

## 🚀 Additional Performance Tips

### 1. **Supabase Data Caching**
Consider implementing localStorage caching for frequently accessed data:

```javascript
// Cache sermon data for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedSermons() {
  const cached = localStorage.getItem('sermons_cache');
  const timestamp = localStorage.getItem('sermons_timestamp');
  
  if (cached && timestamp && (Date.now() - timestamp < CACHE_DURATION)) {
    return JSON.parse(cached);
  }
  
  // Fetch fresh data
  const sermons = await fetchSermonsFromSupabase();
  localStorage.setItem('sermons_cache', JSON.stringify(sermons));
  localStorage.setItem('sermons_timestamp', Date.now());
  
  return sermons;
}
```

### 2. **YouTube Embed Optimization**
Use thumbnail images with click-to-play instead of embedding iframes immediately:

```javascript
// Replace iframe with thumbnail on page load
function optimizeYouTubeEmbeds() {
  document.querySelectorAll('.youtube-embed').forEach(container => {
    const videoId = container.dataset.videoId;
    container.innerHTML = `
      <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
           alt="Video Thumbnail" 
           loading="lazy"
           onclick="loadYouTubeVideo('${videoId}', this.parentElement)">
      <button class="play-button">▶</button>
    `;
  });
}
```

### 3. **Font Loading Optimization**
Add to CSS for better font rendering:

```css
@font-face {
  font-family: 'Montserrat';
  font-display: swap; /* Prevent invisible text while loading */
  src: url('fonts/montserrat.woff2') format('woff2');
}
```

### 4. **Service Worker (PWA)**
Consider implementing a service worker for offline caching:

```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/css/styles.css',
        '/js/main.js',
        '/assets/images/hero.webp'
      ]);
    })
  );
});
```

## 📊 Performance Metrics to Monitor

Use tools like:
- **Google Lighthouse** (built into Chrome DevTools)
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/

### Target Scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

### Key Metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔧 Quick Wins

1. ✅ Enable Gzip compression on server (`.htaccess` already configured)
2. ✅ Lazy load images below the fold
3. ✅ Preload critical resources
4. 🔲 Optimize and convert images to WebP
5. 🔲 Implement caching for Supabase data
6. 🔲 Minify CSS and JavaScript files for production
7. 🔲 Use CDN for static assets

## 📱 Mobile-Specific Optimizations

### Tested Breakpoints:
- **Extra Small**: 375px (iPhone SE)
- **Small**: 480px (Standard mobile)
- **Medium**: 768px (Tablets)
- **Large**: 992px (Desktop)
- **Extra Large**: 1200px+ (Large desktop)

### Mobile Features:
- Touch-friendly button sizes (min 44x44px)
- Optimized font sizes for readability
- Reduced animations on mobile
- Scroll-based lazy loading
- Background images scroll (not fixed) for better performance

## 🎨 CSS Optimization

Current optimizations:
- CSS Grid for responsive layouts
- `clamp()` for fluid typography
- Hardware-accelerated animations (`transform`, `opacity`)
- Reduced paint operations on scroll

## 📝 Next Steps

1. **Image Optimization**: Convert all images to WebP format
2. **Code Splitting**: Consider splitting JavaScript into smaller chunks
3. **HTTP/2**: Ensure server supports HTTP/2 for multiplexing
4. **Critical CSS**: Inline critical CSS in `<head>` for faster initial render
5. **Analytics**: Add performance monitoring (e.g., Google Analytics)

---

**Last Updated**: October 30, 2025
