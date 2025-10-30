// Supabase Authentication Module
import { supabase } from './supabase-config.js';

// Helper function to get the correct base path for GitHub Pages
function getBasePath() {
    // Check if we're on GitHub Pages
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    if (hostname.includes('github.io')) {
        // Extract repo name from path (e.g., /eveninglight/)
        const match = pathname.match(/^\/([^\/]+)\//);
        if (match) {
            return `/${match[1]}/admin`;
        }
    }
    
    // Check if we're in the admin folder already
    if (pathname.includes('/admin/')) {
        return pathname.substring(0, pathname.indexOf('/admin/') + 6);
    }
    
    // Default to relative path
    return './';
}

// Helper function to build admin URL
function getAdminUrl(page) {
    const basePath = getBasePath();
    if (basePath.startsWith('/')) {
        // Absolute path for GitHub Pages
        return `${basePath}${page}`;
    }
    // Relative path for local
    return `./${page}`;
}

// Login function
export async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        return {
            success: true,
            user: data.user,
            session: data.session
        };
    } catch (error) {
        console.error('Login error:', error);
        
        // Provide user-friendly error messages
        let userMessage = 'Login failed. Please try again.';
        
        if (error.message.includes('Invalid login credentials')) {
            userMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
            userMessage = 'Please verify your email address before logging in.';
        } else if (error.message.includes('User not found')) {
            userMessage = 'No account found with this email address.';
        } else if (error.message.includes('network')) {
            userMessage = 'Network error. Please check your internet connection.';
        }
        
        return {
            success: false,
            error: userMessage
        };
    }
}

// Logout function
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear any stored session data
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();

        // Redirect to login page with proper path
        window.location.href = getAdminUrl('login.html');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Check if user is authenticated
export async function checkAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        return {
            authenticated: !!session,
            session: session,
            user: session?.user || null
        };
    } catch (error) {
        console.error('Auth check error:', error);
        return {
            authenticated: false,
            error: error.message
        };
    }
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        return {
            success: true,
            user: user
        };
    } catch (error) {
        console.error('Get user error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Protect admin pages - redirect to login if not authenticated
export async function protectAdminPage() {
    const authStatus = await checkAuth();
    
    if (!authStatus.authenticated) {
        window.location.href = getAdminUrl('login.html');
        return false;
    }
    
    return true;
}

// Initialize auth for login page
if (window.location.pathname.includes('login.html')) {
    // Check if user is already logged in
    checkAuth().then(authStatus => {
        if (authStatus.authenticated) {
            window.location.href = getAdminUrl('dashboard.html');
        }
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const errorDiv = document.getElementById('errorMessage');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlEmail = urlParams.get('email');
        const urlPassword = urlParams.get('password');

        // Auto-fill if URL parameters exist
        if (urlEmail) {
            emailInput.value = decodeURIComponent(urlEmail);
        }
        
        if (urlPassword) {
            passwordInput.value = decodeURIComponent(urlPassword);
        }

        // Auto-login if both email and password are in URL
        if (urlEmail && urlPassword) {
            // Show loading state immediately
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Auto-logging in...';
            
            // Wait longer on mobile for better reliability
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const delay = isMobile ? 2000 : 1000; // Increased mobile delay
            
            setTimeout(async () => {
                // Manually trigger login instead of form submit
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                
                const result = await login(email, password);

                if (result.success) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success! Redirecting...';
                    submitBtn.style.background = '#10b981';
                    
                    // Clear URL parameters for security
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                    // Wait longer on mobile before redirecting
                    setTimeout(() => {
                        window.location.href = getAdminUrl('dashboard.html');
                    }, isMobile ? 1000 : 500);
                } else {
                    errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (result.error || 'Login failed. Please try again.');
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                    
                    // Clear URL parameters on error
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }, delay);
        }

        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';

            const result = await login(email, password);

            if (result.success) {
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success! Redirecting...';
                submitBtn.style.background = '#10b981';
                
                // Clear URL parameters for security
                if (urlEmail || urlPassword) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                
                // Detect mobile and wait longer before redirect
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                
                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = getAdminUrl('dashboard.html');
                }, isMobile ? 1000 : 500);
            } else {
                // Show error with icon
                errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (result.error || 'Login failed. Please try again.');
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                
                // Clear URL parameters on error for security
                if (urlEmail || urlPassword) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        });
    });
}

// Initialize auth protection for dashboard
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        await protectAdminPage();
    });
}
