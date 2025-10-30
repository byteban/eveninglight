# 🚀 Supabase CMS - Quick Start Guide

**Evening Light Tabernacle Church Website**

## ✅ What You've Got

Your church website now has a complete **Supabase-powered Content Management System**! Here's what's included:

### 🎯 Features
- ✨ **Admin Dashboard** - Beautiful, easy-to-use interface
- 🔐 **Secure Login** - Email/password authentication
- 📖 **Sermon Management** - Upload with YouTube integration
- 📢 **Announcements** - Create with priority levels
- 📷 **Photo Gallery** - Upload multiple photos at once
- 💰 **100% FREE** - No credit card required
- 📱 **Mobile Responsive** - Works on all devices

---

## 🎬 Getting Started (3 Simple Steps)

### Step 1: Setup Supabase (15-20 minutes)

1. **Open `SUPABASE-SETUP-GUIDE.md`**
2. Follow steps 1-7 carefully
3. Your credentials will look like:
   ```
   URL: https://xxxxx.supabase.co
   KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 2: Configure Website (2 minutes)

1. Open `src/js/supabase-config.js`
2. Replace placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_ACTUAL_URL_HERE';
   const supabaseAnonKey = 'YOUR_ACTUAL_KEY_HERE';
   ```
3. Save the file

### Step 3: Test Locally (5 minutes)

1. Open `src/admin/login.html` in your browser
2. Login with the admin credentials you created
3. Upload a test sermon, announcement, and photo
4. Check your public pages to see the content

---

## 📚 Documentation Files

| File | Purpose | Who Needs It |
|------|---------|--------------|
| **SUPABASE-SETUP-GUIDE.md** | Complete Supabase setup with SQL | 👨‍💻 You (one-time setup) |
| **ADMIN-GUIDE.md** | How to use admin dashboard | 👥 Media team (daily use) |
| **README.md** | Technical overview & deployment | 👨‍💻 Developers |
| **QUICK-START-GUIDE.md** | This file! | ✅ Everyone |

---

## ✅ Setup Checklist

### Initial Setup
- [ ] Created Supabase account at supabase.com
- [ ] Created new project named "eveninglight-church"
- [ ] Copied Project URL and anon key
- [ ] Updated `src/js/supabase-config.js` with credentials
- [ ] Ran database setup SQL in Supabase SQL Editor
- [ ] Created `gallery` storage bucket with public access
- [ ] Set up Row Level Security policies
- [ ] Created admin user in Supabase Authentication

### Testing
- [ ] Opened `src/admin/login.html` in browser
- [ ] Successfully logged in to admin dashboard
- [ ] Uploaded test sermon with YouTube link
- [ ] Created test announcement
- [ ] Uploaded test photo to gallery
- [ ] Verified sermon appears on sermons page
- [ ] Verified announcement appears on announcements page
- [ ] Verified photo appears in gallery

---

## 🆘 Common Issues

### Can't login?
- Verify user exists in Supabase → Authentication
- Check "Auto Confirm User" was enabled
- Clear browser cache

### Content won't upload?
- Check credentials in `supabase-config.js`
- Verify database tables exist
- Check Row Level Security policies

### Photos won't upload?
- Verify `gallery` bucket exists
- Check "Public bucket" is enabled
- Ensure photo size < 5MB

---

## 💰 Cost: $0/month

- Supabase Free: 500MB DB + 1GB storage
- Hosting: GitHub Pages/Netlify (FREE)
- **Total:** Completely FREE! 🎉

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Church Admin Guide:** See `ADMIN-GUIDE.md`

---

**Ready?** Open `SUPABASE-SETUP-GUIDE.md` and start with Step 1!
