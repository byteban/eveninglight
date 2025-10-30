# 🧪 Testing Guide - Supabase CMS

This guide will help you test your Supabase CMS implementation to ensure everything works correctly.

---

## ✅ Pre-Testing Checklist

Before you begin testing, make sure you've completed:

- [ ] Created Supabase account
- [ ] Created project and got credentials
- [ ] Updated `src/js/supabase-config.js` with real credentials
- [ ] Ran database setup SQL in Supabase
- [ ] Created `gallery` storage bucket
- [ ] Set up Row Level Security policies
- [ ] Created admin user in Supabase Authentication

---

## 🧪 Test Plan

### Test 1: Admin Login ✅

**Steps:**
1. Open `src/admin/login.html` in your browser
2. Enter your admin email and password
3. Click "Sign In"

**Expected Results:**
- ✅ Redirects to `dashboard.html`
- ✅ Welcome message shows your email
- ✅ No error messages

**If it fails:**
- Check credentials in Supabase → Authentication
- Verify "Auto Confirm User" was checked
- Check browser console (F12) for errors
- Verify `supabase-config.js` has correct credentials

---

### Test 2: Sermon Upload ✅

**Steps:**
1. Click "Sermons" tab (should already be active)
2. Fill in the form:
   - **Title:** "Test Sermon - The Power of Prayer"
   - **Date:** Today's date
   - **Pastor:** "Pastor John Smith"
   - **Scripture:** "Matthew 6:9-13"
   - **YouTube URL:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - **Description:** "A powerful message about prayer"
3. Click "Upload Sermon"

**Expected Results:**
- ✅ Green toast notification "Sermon uploaded successfully!"
- ✅ Form clears automatically
- ✅ New sermon appears in "Uploaded Sermons" list below
- ✅ Sermon shows all details correctly

**If it fails:**
- Check database tables exist in Supabase
- Verify RLS policies are set correctly
- Check browser console for errors
- Ensure you're logged in (session active)

---

### Test 3: Sermon Display on Website ✅

**Steps:**
1. Open new browser tab
2. Navigate to `src/pages/sermons.html`
3. Look for your test sermon

**Expected Results:**
- ✅ Test sermon appears in the sermons grid
- ✅ YouTube video is embedded and playable
- ✅ All details display correctly (title, pastor, date, scripture)

**If it fails:**
- Hard refresh page (Ctrl+F5)
- Check Supabase Row Level Security allows public SELECT
- Verify sermon was actually saved (check Supabase table)

---

### Test 4: Sermon Delete ✅

**Steps:**
1. Go back to admin dashboard
2. Find your test sermon in the list
3. Click the red "Delete" button
4. Click "OK" in the confirm dialog

**Expected Results:**
- ✅ Confirm dialog appears
- ✅ Green toast "Sermon deleted successfully"
- ✅ Sermon disappears from list

**If it fails:**
- Check RLS policies allow authenticated DELETE
- Verify you're still logged in
- Check browser console for errors

---

### Test 5: Announcement Creation ✅

**Steps:**
1. Click "Announcements" tab
2. Fill in the form:
   - **Title:** "Test Announcement - Youth Meeting"
   - **Date:** Next Sunday's date
   - **Message:** "Join us for youth fellowship next Sunday at 3 PM. Bring a friend!"
   - **Priority:** "High Priority"
3. Click "Create Announcement"

**Expected Results:**
- ✅ Green toast "Announcement created successfully!"
- ✅ Form clears
- ✅ Announcement appears in list below with orange "High Priority" badge

**If it fails:**
- Same troubleshooting as sermons
- Check announcements table exists
- Verify RLS policies

---

### Test 6: Announcement Display ✅

**Steps:**
1. Open new tab
2. Navigate to `src/pages/announcements.html`
3. Look for your test announcement

**Expected Results:**
- ✅ Announcement appears in list
- ✅ Orange highlight (because it's high priority)
- ✅ All details correct

---

### Test 7: Photo Upload ✅

**Steps:**
1. Back to admin dashboard
2. Click "Gallery" tab
3. Click "Choose Files" button
4. Select 1-3 test photos from your computer
5. Add caption: "Test Photos - Church Event"
6. Click "Upload Photos"

**Expected Results:**
- ✅ Upload progress visible
- ✅ Green toast "X photo(s) uploaded successfully!"
- ✅ Photos appear in gallery grid below
- ✅ Each photo shows caption and date

**If it fails:**
- Check `gallery` storage bucket exists
- Verify bucket is set to "Public"
- Check storage policies are correct
- Ensure photos are under 5MB each
- Try uploading one photo at a time

---

### Test 8: Photo Display on Website ✅

**Steps:**
1. Open new tab
2. Navigate to `src/pages/gallery.html`
3. Look for your test photos

**Expected Results:**
- ✅ Photos appear in gallery
- ✅ Images load correctly
- ✅ Caption visible on hover or below image

---

### Test 9: Photo Delete ✅

**Steps:**
1. Back to admin dashboard, Gallery tab
2. Find one of your test photos
3. Click red "Delete" button
4. Confirm deletion

**Expected Results:**
- ✅ Confirm dialog appears
- ✅ Green toast "Photo deleted successfully"
- ✅ Photo disappears from gallery
- ✅ File removed from Supabase Storage

---

### Test 10: Logout & Re-login ✅

**Steps:**
1. Click "Logout" button (top right)
2. Should redirect to login page
3. Try accessing `dashboard.html` directly
4. Should redirect back to login
5. Login again

**Expected Results:**
- ✅ Logout redirects to login page
- ✅ Can't access dashboard without login
- ✅ Can successfully login again
- ✅ Session persists across tabs

---

### Test 11: Mobile Responsiveness 📱

**Steps:**
1. Open admin login on mobile device or use browser DevTools
2. Test on various screen sizes:
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667

**Expected Results:**
- ✅ Login page looks good on all sizes
- ✅ Dashboard tabs stack or scroll horizontally on mobile
- ✅ Forms are usable on mobile
- ✅ Buttons are touch-friendly
- ✅ No horizontal scrolling

---

### Test 12: Fallback System ✅

**Steps:**
1. Temporarily break Supabase connection:
   - Change URL in `supabase-config.js` to `'https://invalid.supabase.co'`
2. Refresh public pages (sermons, announcements)
3. Restore correct URL

**Expected Results:**
- ✅ Pages still load (using local JSON fallback)
- ✅ Console shows "Supabase not available" message
- ✅ After restoring URL, Supabase data loads again

---

### Test 13: Error Handling 🚨

**Steps:**
1. Try uploading photo over 5MB
2. Try uploading sermon with empty required fields
3. Try creating announcement without title

**Expected Results:**
- ✅ Large photo shows error toast
- ✅ Required fields show validation error
- ✅ Form doesn't submit with missing data
- ✅ Error messages are clear and helpful

---

### Test 14: YouTube URL Formats ▶️

**Steps:**
Test these different YouTube URL formats:

1. Standard: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. Short: `https://youtu.be/dQw4w9WgXcQ`
3. Embed: `https://www.youtube.com/embed/dQw4w9WgXcQ`

**Expected Results:**
- ✅ All formats work
- ✅ Videos embed correctly
- ✅ Videos are playable

---

### Test 15: Multi-Tab Session ✅

**Steps:**
1. Login to admin dashboard
2. Open dashboard in another tab
3. Logout in one tab
4. Try to perform action in other tab

**Expected Results:**
- ✅ Both tabs stay logged in initially
- ✅ After logout, session ends in both tabs
- ✅ Actions in second tab redirect to login

---

## 🐛 Common Issues & Fixes

### Issue: "Invalid API Key" Error

**Symptoms:**
- Can't login
- Nothing loads
- Console shows authentication errors

**Solution:**
1. Double-check `supabase-config.js` credentials
2. Verify you copied the **anon public** key (not service role)
3. Ensure no extra spaces or quotes
4. Refresh page after fixing

---

### Issue: "Permission Denied" on Upload

**Symptoms:**
- Content uploads fail
- Console shows "permission denied" or "RLS policy"

**Solution:**
1. Go to Supabase → Database → Policies
2. Verify policies exist for all tables
3. Check authenticated users have INSERT/DELETE permissions
4. Re-run the policy SQL if needed

---

### Issue: Photos Won't Upload

**Symptoms:**
- Upload button does nothing
- Error toast appears
- Photos don't show in gallery

**Solution:**
1. Check storage bucket exists (`gallery`)
2. Verify bucket is set to "Public"
3. Check storage policies allow authenticated uploads
4. Ensure photos are under 5MB
5. Try uploading one photo at a time

---

### Issue: Can't See Public Content

**Symptoms:**
- Sermons/announcements don't show on public pages
- Console shows no errors
- Admin dashboard works fine

**Solution:**
1. Check RLS policies allow public SELECT
2. Hard refresh page (Ctrl+F5)
3. Check browser console for errors
4. Verify data exists in Supabase tables
5. Test fallback by checking local JSON files

---

### Issue: Logout Doesn't Work

**Symptoms:**
- Clicking logout does nothing
- Still accessing dashboard after logout
- Session persists

**Solution:**
1. Check browser console for errors
2. Clear browser cookies/localStorage
3. Verify `supabase-auth.js` is loaded
4. Try logout in incognito/private window

---

## ✅ Success Criteria

Your CMS is working perfectly when:

- ✅ Can login to admin dashboard
- ✅ Can upload sermons with YouTube videos
- ✅ Can create announcements with priority
- ✅ Can upload multiple photos
- ✅ All content appears on public pages
- ✅ Can delete content
- ✅ Logout works correctly
- ✅ Mobile responsive
- ✅ Error messages are helpful
- ✅ No console errors (except fallback messages)

---

## 📊 Testing Checklist

Print this and check off as you test:

### Core Functionality
- [ ] Admin login works
- [ ] Sermon upload works
- [ ] Sermon displays on public page
- [ ] Sermon delete works
- [ ] Announcement creation works
- [ ] Announcement displays on public page
- [ ] Announcement delete works
- [ ] Photo upload works (single)
- [ ] Photo upload works (multiple)
- [ ] Photos display in gallery
- [ ] Photo delete works
- [ ] Logout works
- [ ] Re-login works

### Edge Cases
- [ ] Large photo rejected (> 5MB)
- [ ] Required fields validated
- [ ] YouTube URL formats all work
- [ ] Fallback system works
- [ ] Session management correct
- [ ] Error messages helpful

### Devices
- [ ] Desktop (Chrome)
- [ ] Desktop (Firefox)
- [ ] Desktop (Edge)
- [ ] Mobile (iOS Safari)
- [ ] Mobile (Android Chrome)
- [ ] Tablet

### Security
- [ ] Can't access dashboard without login
- [ ] Logout ends session everywhere
- [ ] Public can view content
- [ ] Only authenticated can create/delete

---

## 🎯 Performance Checklist

- [ ] Pages load in < 3 seconds
- [ ] Photos display quickly
- [ ] No layout shift on load
- [ ] Smooth animations
- [ ] No console warnings
- [ ] YouTube embeds load fast

---

## 📝 Test Results Template

```
Test Date: _______________
Tester Name: _____________

Test 1 (Login): ☐ Pass ☐ Fail
Test 2 (Sermon Upload): ☐ Pass ☐ Fail
Test 3 (Sermon Display): ☐ Pass ☐ Fail
Test 4 (Sermon Delete): ☐ Pass ☐ Fail
Test 5 (Announcement Create): ☐ Pass ☐ Fail
Test 6 (Announcement Display): ☐ Pass ☐ Fail
Test 7 (Photo Upload): ☐ Pass ☐ Fail
Test 8 (Photo Display): ☐ Pass ☐ Fail
Test 9 (Photo Delete): ☐ Pass ☐ Fail
Test 10 (Logout/Re-login): ☐ Pass ☐ Fail
Test 11 (Mobile): ☐ Pass ☐ Fail
Test 12 (Fallback): ☐ Pass ☐ Fail
Test 13 (Error Handling): ☐ Pass ☐ Fail
Test 14 (YouTube URLs): ☐ Pass ☐ Fail
Test 15 (Multi-Tab): ☐ Pass ☐ Fail

Overall Status: ☐ All Tests Pass ☐ Some Issues

Notes:
___________________________________
___________________________________
___________________________________
```

---

## 🎉 When All Tests Pass

Congratulations! Your CMS is production-ready!

**Next steps:**
1. Deploy to hosting platform
2. Test again on live site
3. Train your media team
4. Share `ADMIN-GUIDE.md` with them
5. Launch officially! 🚀

---

*Last Updated: October 2025*  
*Purpose: Comprehensive testing guide*  
*Status: Ready for testing*
