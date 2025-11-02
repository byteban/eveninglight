// Supabase Configuration
// Import Supabase client library from CDN
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Supabase project credentials
// TODO: Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://tvqhvavhkotitmdjcfvh.supabase.co'; // Example: https://xxxxx.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cWh2YXZoa290aXRtZGpjZnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDAzMDYsImV4cCI6MjA3NzM3NjMwNn0.uF-lYZmz5k2ha4pAspFXvlWyMmhpm9KhBWTkFA6XYEo'; // Get from Supabase dashboard

// Initialize Supabase client with enhanced mobile support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use localStorage for better mobile compatibility
        storage: window.localStorage,
        // Auto refresh tokens
        autoRefreshToken: true,
        // Persist session across page reloads
        persistSession: true,
        // Detect session from URL (for OAuth flows)
        detectSessionInUrl: true,
        // Set flow type to 'pkce' for better security on mobile
        flowType: 'pkce'
    }
});

// Helper function to format dates
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper function to get YouTube embed URL
export function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
        const questionPosition = videoId.indexOf('?');
        if (questionPosition !== -1) {
            videoId = videoId.substring(0, questionPosition);
        }
    } else if (url.includes('youtube.com/embed/')) {
        return url; // Already in embed format
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// Helper function to handle errors
export function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Provide more specific error messages
    let errorMessage = 'An unknown error occurred';
    
    if (error.message) {
        errorMessage = error.message;
    }
    
    // Check for common connection errors
    if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to database. Please check your internet connection.';
    } else if (error.message && error.message.includes('CORS')) {
        errorMessage = 'CORS error: Database access blocked. Please check your Supabase configuration.';
    } else if (error.code === 'PGRST116') {
        errorMessage = 'Database error: The requested resource was not found.';
    } else if (error.code === 'PGRST301') {
        errorMessage = 'Permission error: You do not have access to perform this action.';
    }
    
    return {
        success: false,
        error: errorMessage,
        details: error
    };
}

// Test Supabase connection
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('Connection test failed:', error);
            return { connected: false, error: error.message };
        }
        
        console.log('Connection test successful');
        return { connected: true };
    } catch (error) {
        console.error('Connection test error:', error);
        return { connected: false, error: error.message };
    }
}

// Helper function to show loading state
export function setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isLoading) {
            element.classList.add('loading');
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        } else {
            element.classList.remove('loading');
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        }
    }
}
