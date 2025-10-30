# GitHub Pages Deployment Guide

## 🎉 Your Site is Ready!

Your Evening Light Tabernacle website has been configured for GitHub Pages and pushed to GitHub.

### 📍 Live URL
**https://byteban.github.io/eveninglight/**

---

## ⚙️ Enabling GitHub Pages (One-Time Setup)

1. Go to your repository: https://github.com/byteban/eveninglight
2. Click on **Settings** (gear icon in the top navigation)
3. In the left sidebar, click **Pages**
4. Under **Source**, configure:
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

GitHub will show you the URL where your site is published!

---

## 🔄 Updating Your Website

Whenever you make changes to your website:

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

Changes will automatically deploy to GitHub Pages within 1-2 minutes.

---

## ✅ What Was Configured

### 1. **File Structure**
   - Moved all files from `src/` to root directory
   - GitHub Pages serves from root by default

### 2. **Navigation Updates**
   - Updated `js/main.js` to handle GitHub Pages base URL (`/eveninglight`)
   - Navigation automatically detects if running on GitHub Pages

### 3. **404 Page**
   - Created `404.html` for clean URL redirects
   - Handles routes like `/sermons` → `/pages/sermons.html`

### 4. **Jekyll Bypass**
   - Added `.nojekyll` file to prevent Jekyll processing
   - Ensures all files are served correctly

### 5. **README Updated**
   - Added live site link
   - Added deployment instructions

---

## 🌐 Custom Domain (Optional)

Want to use your own domain like `www.eveninglighttabernacle.org`?

### Step 1: Add CNAME File
Create a file named `CNAME` in your repository root:
```
www.eveninglighttabernacle.org
```

### Step 2: Configure DNS
At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `byteban.github.io`

**For apex domain (optional):**
- Type: `A`
- Name: `@`
- Values: 
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

### Step 3: Enable in GitHub
1. Go to Settings → Pages
2. Enter your custom domain
3. Check "Enforce HTTPS"

---

## 🔧 Troubleshooting

### Site Not Loading?
- Wait 2-3 minutes after pushing
- Check Settings → Pages to ensure it's enabled
- Verify branch is set to `main` and folder is `/ (root)`

### Images Not Showing?
- Ensure file paths use relative URLs (e.g., `assets/images/logo.png`)
- Check that image files are committed to repository

### Navigation Issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Test in incognito/private mode

### 404 Errors?
- Ensure all HTML files have `.html` extensions
- Check that file paths match exactly (case-sensitive on GitHub)

---

## 📱 Testing Your Site

Test these URLs once deployed:
- https://byteban.github.io/eveninglight/ (Home)
- https://byteban.github.io/eveninglight/pages/sermons.html
- https://byteban.github.io/eveninglight/pages/gallery.html
- https://byteban.github.io/eveninglight/pages/announcements.html
- https://byteban.github.io/eveninglight/pages/about.html
- https://byteban.github.io/eveninglight/pages/contact.html
- https://byteban.github.io/eveninglight/admin/login.html

---

## 🎨 Next Steps

1. **Enable GitHub Pages** (follow instructions above)
2. **Test the live site** in multiple browsers
3. **Update content** as needed
4. **Consider a custom domain** for professional appearance
5. **Monitor** the site performance and user feedback

---

## 📞 Support

If you encounter issues:
1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the [Troubleshooting](#-troubleshooting) section above
3. Check repository Actions tab for deployment logs

---

## ✨ Features Working on GitHub Pages

✅ Responsive design  
✅ Navigation with clean URLs  
✅ Supabase integration (client-side)  
✅ Admin dashboard and authentication  
✅ Announcements system  
✅ Sermon videos  
✅ Photo gallery  
✅ Contact forms  
✅ Mobile-friendly menu  

---

**Congratulations! Your church website is now live on the internet! 🎉**
