# Latest Sermon Dynamic Loading - Update

## Overview
Updated the home page to dynamically load the latest sermon from Supabase (with JSON fallback), matching the behavior of the sermons page.

---

## Changes Made

### 1. **Fixed `loadHomePageContent()` Function** (`js/main.js`)

#### Before
- Always ran both Supabase and JSON fetching simultaneously
- JSON fallback would overwrite Supabase data
- No proper error handling or loading state tracking

#### After
- Uses a `sermonLoaded` flag to track success
- Only attempts JSON fallback if Supabase fails or returns no data
- Better error handling with descriptive console messages
- Converted to fully async/await pattern for cleaner code

```javascript
async function loadHomePageContent() {
    let sermonLoaded = false;
    
    // Try Supabase first
    try {
        const { data, error } = await supabase
            .from('sermons')
            .select('*')
            .order('date', { ascending: false })
            .limit(1);
        
        if (!error && data && data.length > 0) {
            displayLatestSermon(data[0], true);
            sermonLoaded = true;
        }
    } catch (error) {
        console.log('Supabase not available, will use local data');
    }
    
    // Fallback to JSON only if needed
    if (!sermonLoaded) {
        // Load from data/sermons.json
    }
}
```

### 2. **Enhanced `displayLatestSermon()` Function** (`js/main.js`)

#### Improvements
- **Better Error Handling**: Checks if sermon card container exists
- **Default Values**: Provides fallback values for missing data
- **Responsive Video**: Uses aspect ratio padding (56.25% for 16:9)
- **Enhanced Styling**: Inline styles using CSS variables
- **Complete Information Display**:
  - Sermon title
  - Pastor name
  - Date (formatted)
  - Scripture reference
  - Description
  - Call-to-action button to view all sermons
- **Placeholder Fallback**: Shows image if no video URL available
- **Console Logging**: Helps with debugging

#### Video Display
- Responsive iframe container with proper aspect ratio
- Lazy loading for better performance
- Proper border radius matching site theme
- Full accessibility attributes

### 3. **Updated Home Page HTML** (`index.html`)

#### Before
```html
<div class="sermon-card">
    <img src="assets/images/placeholder.png" alt="Sermon Video">
    <div class="sermon-info">
        <h3>Title of the Latest Sermon</h3>
        <p>Brief description...</p>
        <a href="pages/sermons.html" class="btn">WATCH NOW</a>
    </div>
</div>
```

#### After
```html
<div class="sermon-card">
    <!-- Loading state with spinner -->
    <div style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading latest sermon...</p>
    </div>
</div>
```

**Benefits:**
- Shows loading indicator while fetching data
- Prevents layout shift when content loads
- Better user experience with visual feedback
- Will be replaced by actual sermon content when loaded

---

## Data Flow

### 1. **Page Load**
```
index.html loads → main.js initializes → loadHomePageContent() called
```

### 2. **Sermon Loading Priority**
```
1. Try Supabase (newest sermons, order by date descending)
   ↓ Success? → Display sermon
   ↓ Fail or empty?
2. Try local JSON (data/sermons.json)
   ↓ Success? → Display sermon
   ↓ Fail?
3. Show loading state (user sees spinner)
```

### 3. **Display Process**
```
Sermon data received
   ↓
Check for video URL
   ↓ Yes? → Display embedded YouTube video
   ↓ No? → Display placeholder image
   ↓
Add sermon info (title, pastor, date, scripture, description)
   ↓
Add "VIEW ALL SERMONS" button
```

---

## Features

### ✅ Dynamic Loading
- Fetches latest sermon from Supabase database
- Automatically updates when new sermons are added
- No manual HTML editing required

### ✅ Graceful Fallback
- Falls back to local JSON if Supabase unavailable
- Shows loading state during fetch
- Handles missing data gracefully

### ✅ Rich Display
- Embedded YouTube video player
- Pastor name and date
- Scripture reference
- Full sermon description
- Link to view all sermons

### ✅ Responsive Design
- Video maintains 16:9 aspect ratio
- Works on all screen sizes
- Mobile-friendly controls

### ✅ Performance
- Lazy loading for iframe
- Only loads latest sermon (limit 1)
- Efficient database query

---

## Testing Checklist

### Desktop
- [ ] Sermon loads from Supabase
- [ ] Video displays correctly
- [ ] All information shows (title, pastor, date, scripture, description)
- [ ] "VIEW ALL SERMONS" button works
- [ ] Loading spinner shows briefly

### Mobile
- [ ] Video is responsive
- [ ] Text is readable
- [ ] Button is touch-friendly
- [ ] No horizontal overflow

### Fallback
- [ ] Works when Supabase is unavailable
- [ ] Loads from local JSON
- [ ] Shows placeholder if no video URL

### Edge Cases
- [ ] Handles missing description
- [ ] Handles missing scripture
- [ ] Handles missing video URL
- [ ] Handles empty database

---

## Technical Details

### Supabase Query
```javascript
supabase
    .from('sermons')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
```
- Fetches from `sermons` table
- Orders by `date` (newest first)
- Gets only 1 result (the latest)

### Field Mapping
| Supabase Field | JSON Field | Display |
|----------------|-----------|---------|
| `video_url`    | `videoUrl` | YouTube embed |
| `date`         | `date`     | Formatted date |
| `title`        | `title`    | Sermon title |
| `pastor`       | `pastor`   | Pastor name |
| `scripture`    | `scripture`| Bible reference |
| `description`  | `description` | Full description |

---

## Future Enhancements (Optional)

1. **Sermon Series Support**: Group sermons by series
2. **Download Audio**: Add MP3 download link
3. **Sermon Notes**: PDF sermon notes download
4. **Related Sermons**: Show related sermons below
5. **Social Sharing**: Share sermon on social media
6. **Sermon Search**: Search sermons by topic/scripture
7. **Playlist**: Auto-play next sermon

---

## Troubleshooting

### Sermon Not Loading
1. Check browser console for errors
2. Verify Supabase connection
3. Check `data/sermons.json` exists
4. Verify table name is `sermons`

### Video Not Playing
1. Verify YouTube URL is valid
2. Check embed permissions
3. Test video URL manually
4. Check iframe allowed attributes

### Layout Issues
1. Clear browser cache
2. Check CSS is loaded
3. Verify responsive breakpoints
4. Test on different devices

---

## Related Files

- `index.html` - Home page with sermon section
- `js/main.js` - Sermon loading logic
- `data/sermons.json` - Fallback sermon data
- `css/styles.css` - Sermon card styling
- `pages/sermons.html` - Full sermons page

---

**Last Updated**: November 2, 2025
**Version**: 1.0
