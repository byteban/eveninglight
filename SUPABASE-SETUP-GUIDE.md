# Supabase Setup Guide for Evening Light Tabernacle

This guide will walk you through setting up Supabase as your church website's backend database and content management system.

## Why Supabase?

✅ **FREE** - No credit card required
✅ **500MB Database** - More than enough for church content
✅ **1GB Storage** - For sermon videos and gallery photos
✅ **SQL Database** - Powerful PostgreSQL with real-time features
✅ **Built-in Authentication** - Secure admin login
✅ **Better than Firebase** - More generous free tier, open-source

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with:
   - **GitHub account** (recommended - fastest)
   - Or email/password
4. Verify your email if prompted

**⏱️ Time: 2 minutes**

## Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the details:
   - **Name**: `eveninglight-church` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., "US East" for USA)
   - **Pricing Plan**: **Free** (already selected)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

**⏱️ Time: 3-5 minutes**

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in the sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: A long string starting with `eyJ...`
4. **Copy both values** - you'll need them in Step 4

**⏱️ Time: 1 minute**

## Step 4: Configure Your Website

1. Open `src/js/supabase-config.js` in your code editor
2. Replace the placeholder values:

```javascript
// BEFORE:
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// AFTER (with your actual values):
const supabaseUrl = 'https://xxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

3. Save the file

**⏱️ Time: 2 minutes**

## Step 5: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Copy and paste this SQL code:

```sql
-- Create sermons table
CREATE TABLE sermons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    pastor TEXT NOT NULL,
    scripture TEXT,
    video_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    text TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gallery table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    file_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view sermons" ON sermons FOR SELECT TO public USING (true);
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT TO public USING (true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT TO public USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Authenticated users can insert sermons" ON sermons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete sermons" ON sermons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete announcements" ON announcements FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete gallery" ON gallery FOR DELETE TO authenticated USING (true);
```

4. Click **"Run"** (or press F5)
5. You should see "Success. No rows returned"

**⏱️ Time: 3 minutes**

## Step 6: Create Storage Bucket for Photos

1. In Supabase dashboard, click **"Storage"** in the sidebar
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `gallery`
   - **Public bucket**: ✅ **Check this box** (important!)
4. Click **"Create bucket"**
5. Click on the `gallery` bucket
6. Click **"Policies"** tab
7. Click **"New policy"**
8. Select **"For full customization"**
9. Create two policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');
```

**Policy 2: Authenticated Upload/Delete**
```sql
CREATE POLICY "Authenticated can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

**⏱️ Time: 5 minutes**

## Step 7: Create Admin User

1. In Supabase dashboard, click **"Authentication"** in the sidebar
2. Click **"Users"** tab
3. Click **"Add user"** → **"Create new user"**
4. Fill in:
   - **Email**: Your email (e.g., `admin@eveninglight.church`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ **Check this box**
5. Click **"Create user"**
6. **Save these credentials** - you'll use them to login to the admin dashboard

**⏱️ Time: 2 minutes**

## Step 8: Test Your Setup

1. Open your website locally (double-click `src/admin/login.html`)
2. Login with the admin credentials you just created
3. Try uploading:
   - A test sermon
   - A test announcement
   - A test photo
4. Check that content appears on your public pages

**⏱️ Time: 5 minutes**

---

## 🎉 You're Done!

Your church website now has:
- ✅ Free database (500MB)
- ✅ Free storage (1GB)
- ✅ Secure authentication
- ✅ Admin dashboard
- ✅ No credit card required
- ✅ No coding needed to manage content

## Next Steps

1. **Deploy your website** (see `README.md` for deployment options)
2. **Share credentials** with your media team
3. **Read `ADMIN-GUIDE.md`** for how to use the admin dashboard

## Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the correct `anon public` key (not the service role key)
- Make sure there are no extra spaces in `supabase-config.js`

### Error: "Failed to fetch"
- Check your Project URL is correct
- Make sure your internet connection is working
- Check browser console (F12) for detailed errors

### Can't login to admin dashboard
- Verify you created a user in Supabase Authentication
- Make sure you checked "Auto Confirm User"
- Check the email/password are correct

### Photos won't upload
- Verify the `gallery` bucket exists
- Make sure "Public bucket" is checked
- Verify storage policies are created correctly
- Check photo size is under 5MB

## Support

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [https://discord.supabase.com](https://discord.supabase.com)
- **Church Website Guide**: See `ADMIN-GUIDE.md`

## Cost Information

**Free Tier Includes:**
- 500MB Database space
- 1GB File storage
- 2GB Bandwidth/month
- 50,000 Monthly active users
- Unlimited API requests

This is **more than enough** for a church website! You likely won't need to upgrade.

If you do exceed limits, Supabase Pro is $25/month with:
- 8GB Database
- 100GB Storage
- 250GB Bandwidth
