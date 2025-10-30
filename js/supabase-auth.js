// Supabase Authentication Module
import { supabase } from './supabase-config.js';

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
        return {
            success: false,
            error: error.message
        };
    }
}

// Logout function
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to login page
        window.location.href = './login.html';
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
        window.location.href = './login.html';
        return false;
    }
    
    return true;
}

// Initialize auth for login page
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const errorDiv = document.getElementById('errorMessage');

        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';

            const result = await login(email, password);

            if (result.success) {
                // Redirect to dashboard
                window.location.href = './dashboard.html';
            } else {
                // Show error
                errorDiv.textContent = result.error || 'Login failed. Please try again.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
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
