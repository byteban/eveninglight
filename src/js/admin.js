// Admin Dashboard JavaScript
import { supabase, formatDate, getYouTubeEmbedUrl } from './supabase-config.js';
import { logout, getCurrentUser } from './supabase-auth.js';
import {
    getSermons,
    createSermon,
    deleteSermon,
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    setActiveAnnouncement,
    toggleAnnouncementPopup,
    getGalleryPhotos,
    uploadPhoto,
    deletePhoto
} from './supabase-data.js';

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Show welcome message with user email
    const userResult = await getCurrentUser();
    if (userResult.success && userResult.user) {
        const welcomeDiv = document.querySelector('.welcome-message');
        if (welcomeDiv) {
            welcomeDiv.textContent = `Welcome, ${userResult.user.email}`;
        }
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', handleLogout);

    // Setup tab navigation
    setupTabNavigation();

    // Setup form handlers
    setupSermonForm();
    setupAnnouncementForm();
    setupGalleryUpload();

    // Load initial data
    await loadSermons();
    await loadAnnouncements();
    await loadGallery();
});

// ==================== TAB NAVIGATION ====================

function setupTabNavigation() {
    const menuBtns = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.admin-section');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.section;

            // Update active button
            menuBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show target section
            sections.forEach(section => {
                if (section.id === target) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
}

// ==================== SERMONS ====================

function setupSermonForm() {
    const form = document.getElementById('sermonForm');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await uploadSermon();
    });
}

async function uploadSermon() {
    const title = document.getElementById('sermonTitle').value;
    const date = document.getElementById('sermonDate').value;
    const pastor = document.getElementById('sermonPastor').value;
    const scripture = document.getElementById('sermonScripture').value;
    const videoUrl = document.getElementById('sermonVideo').value;
    const description = document.getElementById('sermonDescription').value;

    if (!title || !date || !pastor) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const submitBtn = document.querySelector('#sermonForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    const result = await createSermon({
        title,
        date,
        pastor,
        scripture,
        video_url: videoUrl,
        description
    });

    if (result.success) {
        showToast('Sermon uploaded successfully!', 'success');
        document.getElementById('sermonForm').reset();
        await loadSermons();
    } else {
        showToast('Error uploading sermon: ' + result.error, 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Upload Sermon';
}

async function loadSermons() {
    const container = document.getElementById('sermonsList');
    container.innerHTML = '<p>Loading sermons...</p>';

    const result = await getSermons();

    if (result.success) {
        if (result.data.length === 0) {
            container.innerHTML = '<p>No sermons uploaded yet.</p>';
            return;
        }

        container.innerHTML = result.data.map(sermon => `
            <div class="content-item" data-id="${sermon.id}">
                <div class="content-info">
                    <h3>${sermon.title}</h3>
                    <p><strong>Pastor:</strong> ${sermon.pastor}</p>
                    <p><strong>Date:</strong> ${formatDate(sermon.date)}</p>
                    ${sermon.scripture ? `<p><strong>Scripture:</strong> ${sermon.scripture}</p>` : ''}
                    ${sermon.video_url ? `<p><strong>Video:</strong> <a href="${sermon.video_url}" target="_blank">Watch</a></p>` : ''}
                </div>
                <button class="delete-btn" onclick="handleDeleteSermon('${sermon.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<p class="error-message">Error loading sermons: ${result.error}</p>`;
    }
}

window.handleDeleteSermon = async (sermonId) => {
    const confirmed = await showConfirm(
        'Delete Sermon',
        'Are you sure you want to delete this sermon? This action cannot be undone.',
        'Delete',
        'Cancel',
        'fa-exclamation-triangle'
    );
    
    if (!confirmed) {
        return;
    }

    const result = await deleteSermon(sermonId);

    if (result.success) {
        showToast('Sermon deleted successfully', 'success');
        await loadSermons();
    } else {
        showToast('Error deleting sermon: ' + result.error, 'error');
    }
};

// ==================== ANNOUNCEMENTS ====================

function setupAnnouncementForm() {
    const form = document.getElementById('announcementForm');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createNewAnnouncement();
    });
}

async function createNewAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const date = document.getElementById('announcementDate').value;
    const text = document.getElementById('announcementText').value;
    const priority = document.getElementById('announcementPriority').value;
    const whatsappLink = document.getElementById('whatsappLink').value.trim();
    const webLink = document.getElementById('webLink').value.trim();
    const phoneLink = document.getElementById('phoneLink').value.trim();
    const emailLink = document.getElementById('emailLink').value.trim();

    if (!title || !date || !text) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const submitBtn = document.querySelector('#announcementForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    const result = await createAnnouncement({
        title,
        date,
        text,
        priority,
        whatsapp_link: whatsappLink || null,
        web_link: webLink || null,
        phone_link: phoneLink || null,
        email_link: emailLink || null
    });

    if (result.success) {
        showToast('Announcement created successfully!', 'success');
        document.getElementById('announcementForm').reset();
        await loadAnnouncements();
    } else {
        showToast('Error creating announcement: ' + result.error, 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Announcement';
}

async function loadAnnouncements() {
    const container = document.getElementById('announcementsList');
    container.innerHTML = '<p>Loading announcements...</p>';

    const result = await getAnnouncements();

    if (result.success) {
        if (result.data.length === 0) {
            container.innerHTML = '<p>No announcements created yet.</p>';
            return;
        }

        container.innerHTML = result.data.map(announcement => {
            const links = [];
            if (announcement.whatsapp_link) {
                links.push(`<a href="${announcement.whatsapp_link}" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>`);
            }
            if (announcement.web_link) {
                links.push(`<a href="${announcement.web_link}" target="_blank" title="Website"><i class="fas fa-globe"></i></a>`);
            }
            if (announcement.phone_link) {
                const tel = announcement.phone_link.startsWith('tel:') ? announcement.phone_link : `tel:${announcement.phone_link}`;
                links.push(`<a href="${tel}" title="Call"><i class="fas fa-phone"></i></a>`);
            }
            if (announcement.email_link) {
                const mailto = announcement.email_link.startsWith('mailto:') ? announcement.email_link : `mailto:${announcement.email_link}`;
                links.push(`<a href="${mailto}" title="Email"><i class="fas fa-envelope"></i></a>`);
            }
            
            return `
                <div class="content-item ${announcement.priority === 'high' ? 'priority-high' : ''}" data-id="${announcement.id}">
                    <div class="content-info">
                        <div class="radio-group">
                            <input 
                                type="radio" 
                                name="activeAnnouncement" 
                                id="active-${announcement.id}" 
                                value="${announcement.id}"
                                ${announcement.is_active ? 'checked' : ''}
                                onchange="handleSetActiveAnnouncement('${announcement.id}')"
                            >
                            <label for="active-${announcement.id}">Set as Active</label>
                            ${announcement.is_active ? '<span class="active-badge">ACTIVE</span>' : ''}
                        </div>
                        <div class="radio-group" style="margin-top: 8px;">
                            <input 
                                type="checkbox" 
                                id="popup-${announcement.id}" 
                                ${announcement.show_popup ? 'checked' : ''}
                                onchange="handleTogglePopup('${announcement.id}', this.checked)"
                                style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-blue);"
                            >
                            <label for="popup-${announcement.id}" style="cursor: pointer;">
                                <i class="fas fa-window-restore"></i> Show Popup/Banner
                            </label>
                        </div>
                        <h3>${announcement.title}</h3>
                        <p><strong>Date:</strong> ${formatDate(announcement.date)}</p>
                        <p>${announcement.text}</p>
                        ${announcement.priority === 'high' ? '<span class="priority-badge">High Priority</span>' : ''}
                        ${links.length > 0 ? `<p style="margin-top: 10px;"><strong>Links:</strong> ${links.join(' ')}</p>` : ''}
                    </div>
                    <button class="delete-btn" onclick="handleDeleteAnnouncement('${announcement.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = `<p class="error-message">Error loading announcements: ${result.error}</p>`;
    }
}

window.handleSetActiveAnnouncement = async (announcementId) => {
    const result = await setActiveAnnouncement(announcementId);
    
    if (result.success) {
        showToast('Active announcement updated', 'success');
        await loadAnnouncements();
    } else {
        showToast('Error updating active announcement: ' + result.error, 'error');
        await loadAnnouncements(); // Reload to restore previous state
    }
};

window.handleTogglePopup = async (announcementId, showPopup) => {
    const result = await toggleAnnouncementPopup(announcementId, showPopup);
    
    if (result.success) {
        showToast(`Popup ${showPopup ? 'enabled' : 'disabled'} for this announcement`, 'success');
    } else {
        showToast('Error updating popup setting: ' + result.error, 'error');
        await loadAnnouncements(); // Reload to restore previous state
    }
};

window.handleDeleteAnnouncement = async (announcementId) => {
    const confirmed = await showConfirm(
        'Delete Announcement',
        'Are you sure you want to delete this announcement? This action cannot be undone.',
        'Delete',
        'Cancel',
        'fa-exclamation-triangle'
    );
    
    if (!confirmed) {
        return;
    }

    const result = await deleteAnnouncement(announcementId);

    if (result.success) {
        showToast('Announcement deleted successfully', 'success');
        await loadAnnouncements();
    } else {
        showToast('Error deleting announcement: ' + result.error, 'error');
    }
};

// ==================== GALLERY ====================

function setupGalleryUpload() {
    const uploadBtn = document.getElementById('uploadPhotosBtn');
    const fileInput = document.getElementById('photoFiles');

    uploadBtn?.addEventListener('click', async () => {
        const files = fileInput.files;
        const caption = document.getElementById('photoCaption').value;

        if (files.length === 0) {
            showToast('Please select at least one photo', 'error');
            return;
        }

        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        let successCount = 0;
        let errorCount = 0;

        for (let file of files) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast(`${file.name} is too large (max 5MB)`, 'error');
                errorCount++;
                continue;
            }

            const result = await uploadPhoto(file, caption);
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        if (successCount > 0) {
            showToast(`${successCount} photo(s) uploaded successfully!`, 'success');
            fileInput.value = '';
            document.getElementById('photoCaption').value = '';
            await loadGallery();
        }

        if (errorCount > 0) {
            showToast(`${errorCount} photo(s) failed to upload`, 'error');
        }

        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Photos';
    });
}

async function loadGallery() {
    const container = document.getElementById('galleryList');
    container.innerHTML = '<p>Loading photos...</p>';

    const result = await getGalleryPhotos();

    if (result.success) {
        if (result.data.length === 0) {
            container.innerHTML = '<p>No photos uploaded yet.</p>';
            return;
        }

        container.innerHTML = result.data.map(photo => `
            <div class="content-item gallery-item" data-id="${photo.id}">
                <div class="gallery-image">
                    <img src="${photo.image_url}" alt="${photo.caption || 'Gallery photo'}" loading="lazy">
                </div>
                <div class="content-info">
                    ${photo.caption ? `<p>${photo.caption}</p>` : '<p><em>No caption</em></p>'}
                    <p class="photo-date">${formatDate(photo.created_at)}</p>
                </div>
                <button class="delete-btn" onclick="handleDeletePhoto('${photo.id}', '${photo.file_name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<p class="error-message">Error loading gallery: ${result.error}</p>`;
    }
}

window.handleDeletePhoto = async (photoId, fileName) => {
    const confirmed = await showConfirm(
        'Delete Photo',
        'Are you sure you want to delete this photo? This action cannot be undone.',
        'Delete',
        'Cancel',
        'fa-exclamation-triangle'
    );
    
    if (!confirmed) {
        return;
    }

    const result = await deletePhoto(photoId, fileName);

    if (result.success) {
        showToast('Photo deleted successfully', 'success');
        await loadGallery();
    } else {
        showToast('Error deleting photo: ' + result.error, 'error');
    }
};

// ==================== UTILITY FUNCTIONS ====================

async function handleLogout() {
    const confirmed = await showConfirm(
        'Logout Confirmation',
        'Are you sure you want to logout?',
        'Logout',
        'Cancel'
    );
    
    if (confirmed) {
        await logout();
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ==================== CUSTOM MODAL FUNCTIONS ====================

/**
 * Show a custom alert modal
 * @param {string} title - The modal title
 * @param {string} message - The modal message
 * @param {string} iconClass - Font Awesome icon class (e.g., 'fa-info-circle', 'fa-check-circle')
 */
function showModal(title, message, iconClass = 'fa-info-circle') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');
        const modalFooter = document.getElementById('modalFooter');

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalIcon.className = `fas ${iconClass}`;

        // Clear footer and add OK button
        modalFooter.innerHTML = `
            <button class="modal-btn modal-btn-primary" onclick="closeModal()">
                OK
            </button>
        `;

        overlay.classList.add('show');

        // Store resolve function for OK button
        window.closeModal = () => {
            overlay.classList.remove('show');
            resolve(true);
        };

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                window.closeModal();
            }
        };
    });
}

/**
 * Show a custom confirm modal
 * @param {string} title - The modal title
 * @param {string} message - The modal message
 * @param {string} confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} iconClass - Font Awesome icon class (default: 'fa-question-circle')
 */
function showConfirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel', iconClass = 'fa-question-circle') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');
        const modalFooter = document.getElementById('modalFooter');

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalIcon.className = `fas ${iconClass}`;

        // Clear footer and add buttons
        modalFooter.innerHTML = `
            <button class="modal-btn modal-btn-secondary" onclick="modalCancel()">
                ${cancelText}
            </button>
            <button class="modal-btn modal-btn-danger" onclick="modalConfirm()">
                ${confirmText}
            </button>
        `;

        overlay.classList.add('show');

        // Store resolve functions
        window.modalConfirm = () => {
            overlay.classList.remove('show');
            resolve(true);
        };

        window.modalCancel = () => {
            overlay.classList.remove('show');
            resolve(false);
        };

        // Close on overlay click (treat as cancel)
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                window.modalCancel();
            }
        };
    });
}
