// Supabase Data Operations Module
import { supabase, handleError } from './supabase-config.js';

// ==================== SERMONS ====================

// Get all sermons
export async function getSermons() {
    try {
        const { data, error } = await supabase
            .from('sermons')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return handleError(error, 'getSermons');
    }
}

// Add a new sermon
export async function createSermon(sermon) {
    try {
        const { data, error } = await supabase
            .from('sermons')
            .insert([{
                title: sermon.title,
                date: sermon.date,
                pastor: sermon.pastor,
                scripture: sermon.scripture,
                video_url: sermon.video_url,
                description: sermon.description
            }])
            .select();

        if (error) throw error;

        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        return handleError(error, 'createSermon');
    }
}

// Delete a sermon
export async function deleteSermon(sermonId) {
    try {
        const { error } = await supabase
            .from('sermons')
            .delete()
            .eq('id', sermonId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        return handleError(error, 'deleteSermon');
    }
}

// ==================== ANNOUNCEMENTS ====================

// Get all announcements
export async function getAnnouncements() {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return handleError(error, 'getAnnouncements');
    }
}

// Add a new announcement
export async function createAnnouncement(announcement) {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .insert([{
                title: announcement.title,
                date: announcement.date,
                text: announcement.text,
                priority: announcement.priority || 'normal',
                is_active: announcement.is_active || false,
                show_popup: announcement.show_popup || false,
                whatsapp_link: announcement.whatsapp_link || null,
                web_link: announcement.web_link || null,
                phone_link: announcement.phone_link || null,
                email_link: announcement.email_link || null
            }])
            .select();

        if (error) throw error;

        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        return handleError(error, 'createAnnouncement');
    }
}

// Delete an announcement
export async function deleteAnnouncement(announcementId) {
    try {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', announcementId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        return handleError(error, 'deleteAnnouncement');
    }
}

// Get the active announcement
export async function getActiveAnnouncement() {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('is_active', true)
            .order('date', { ascending: false })
            .limit(1);

        if (error) throw error;

        return {
            success: true,
            data: data && data.length > 0 ? data[0] : null
        };
    } catch (error) {
        return handleError(error, 'getActiveAnnouncement');
    }
}

// Set an announcement as active (and deactivate all others)
export async function setActiveAnnouncement(announcementId) {
    try {
        // Check if we have a valid Supabase connection
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        // First, deactivate all announcements
        const { error: deactivateError } = await supabase
            .from('announcements')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows

        if (deactivateError) {
            console.error('Deactivate error:', deactivateError);
            throw deactivateError;
        }

        // Then activate the selected one
        const { data, error } = await supabase
            .from('announcements')
            .update({ is_active: true })
            .eq('id', announcementId)
            .select();

        if (error) {
            console.error('Activate error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('No announcement found with the given ID');
        }

        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        console.error('setActiveAnnouncement error:', error);
        return handleError(error, 'setActiveAnnouncement');
    }
}

// Toggle show_popup for an announcement
export async function toggleAnnouncementPopup(announcementId, showPopup) {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .update({ show_popup: showPopup })
            .eq('id', announcementId)
            .select();

        if (error) throw error;

        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        return handleError(error, 'toggleAnnouncementPopup');
    }
}

// ==================== GALLERY ====================

// Get all gallery photos
export async function getGalleryPhotos() {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return handleError(error, 'getGalleryPhotos');
    }
}

// Upload photo to storage and add to gallery
export async function uploadPhoto(file, caption = '') {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath);

        // Add to gallery table
        const { data, error } = await supabase
            .from('gallery')
            .insert([{
                image_url: publicUrl,
                caption: caption,
                file_name: fileName
            }])
            .select();

        if (error) throw error;

        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        return handleError(error, 'uploadPhoto');
    }
}

// Delete photo from gallery and storage
export async function deletePhoto(photoId, fileName) {
    try {
        // Delete from gallery table
        const { error: dbError } = await supabase
            .from('gallery')
            .delete()
            .eq('id', photoId);

        if (dbError) throw dbError;

        // Delete from storage
        const filePath = `photos/${fileName}`;
        const { error: storageError } = await supabase.storage
            .from('gallery')
            .remove([filePath]);

        if (storageError) {
            console.warn('Storage deletion warning:', storageError);
            // Don't throw error if storage deletion fails
        }

        return { success: true };
    } catch (error) {
        return handleError(error, 'deletePhoto');
    }
}
