
// --- UI Elements ---
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const showSidebarButton = document.getElementById('show-sidebar-button');
const hideSidebarButton = document.getElementById('hide-sidebar-button');
const homeButton = document.getElementById('home-button');
const noteList = document.getElementById('note-list');
const sidebarSearch = document.getElementById('sidebar-search');

const dashboardView = document.getElementById('dashboard');
const notepadView = document.getElementById('notepad-view');
const editorActions = document.getElementById('editor-actions');

const newNoteButton = document.getElementById('new-note-button');
const saveButton = document.getElementById('save-button');
const renameButton = document.getElementById('rename-button');
const deleteButton = document.getElementById('delete-button');
const syncButton = document.getElementById('sync-button');
const linkButton = document.getElementById('link-button');

const toastContainer = document.getElementById('toast-container');

// --- Editor Initialization ---
let quill;
function initQuill() {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean'],
                ['link']
            ]
        },
        placeholder: 'Compose your masterpiece...'
    });

    // Auto-save behavior
    quill.on('text-change', () => {
        if (currentFilename) {
            debounceSaveContent();
        }
    });
}

// --- State ---
let currentFilename = null;
let debounceTimer;
const DEBOUNCE_DELAY = 1500;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// --- Toast System ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- View Shifting ---
function showDashboard() {
    currentFilename = null;
    dashboardView.style.display = 'block';
    notepadView.style.display = 'none';
    editorActions.style.display = 'none';
    
    // Deselect all links
    document.querySelectorAll('.note-link').forEach(link => link.classList.remove('selected-link'));
    document.title = 'imemo - dashboard';
}

function showEditor() {
    dashboardView.style.display = 'none';
    notepadView.style.display = 'block';
    editorActions.style.display = 'flex';
}

function toggleSidebar(hide) {
    if (hide) {
        document.body.classList.add('sidebar-collapsed');
    } else {
        document.body.classList.remove('sidebar-collapsed');
    }
}

// --- API Calls ---
async function loadNote(filename) {
    try {
        const response = await fetch(`/load-file?filename=${filename}`);
        if (!response.ok) throw new Error('Failed to load');
        const content = await response.text();
        
        showEditor();
        
        // Handle both HTML and plain text for backward compatibility
        if (content.startsWith('<')) {
            quill.root.innerHTML = content;
        } else {
            quill.setText(content);
        }
        
        currentFilename = filename;
        updateActiveLink(filename);
        document.title = `imemo - ${filename.replace('.txt', '')}`;
        if (isMobile) toggleSidebar(true); // Auto-hide on mobile
        showToast(`Loaded ${filename}`);
    } catch (error) {
        showToast('Error loading note', 'error');
    }
}

async function saveNote() {
    if (!currentFilename) return;
    const content = quill.root.innerHTML;
    try {
        const response = await fetch(`/save-file?filename=${currentFilename}`, {
            method: 'POST',
            body: content
        });
        if (!response.ok) throw new Error('Save failed');
        console.log('Saved successfully');
        return true;
    } catch (error) {
        showToast('Auto-save failed', 'error');
        return false;
    }
}

function debounceSaveContent() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(saveNote, DEBOUNCE_DELAY);
}

// --- Sidebar & Navigation ---
function updateActiveLink(filename) {
    document.querySelectorAll('.note-link').forEach(link => {
        if (link.getAttribute('data-filename') === filename) {
            link.classList.add('selected-link');
        } else {
            link.classList.remove('selected-link');
        }
    });
}

// --- Event Listeners ---
sidebarSearch.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.note-link').forEach(link => {
        const name = link.textContent.toLowerCase();
        link.style.display = name.includes(term) ? 'flex' : 'none';
    });
});

document.querySelectorAll('.note-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadNote(link.getAttribute('data-filename'));
    });
});

showSidebarButton.addEventListener('click', () => toggleSidebar(false));
hideSidebarButton.addEventListener('click', () => toggleSidebar(true));
homeButton.addEventListener('click', (e) => {
    e.preventDefault();
    showDashboard();
    toggleSidebar(true); // Auto-hide on mobile/tablet when going home
});

saveButton.addEventListener('click', async () => {
    const success = await saveNote();
    if (success) showToast('Saved manually');
});

syncButton.addEventListener('click', () => location.reload());

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveNote().then(success => { if (success) showToast('Saved'); });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        sidebarSearch.focus();
    }
});

// --- Modal Handlers (Existing logic updated) ---
const newNoteModal = document.getElementById('new-note-modal');
const renameModal = document.getElementById('rename-modal');
const confirmationModal = document.getElementById('confirmation-modal');

newNoteButton.addEventListener('click', () => newNoteModal.style.display = 'flex');
renameButton.addEventListener('click', () => {
    if (!currentFilename) return showToast('Select a note first');
    document.getElementById('new-filename').value = currentFilename;
    renameModal.style.display = 'flex';
});

deleteButton.addEventListener('click', () => {
    if (!currentFilename) return showToast('Select a note first');
    document.getElementById('confirmation-message').textContent = `Are you sure you want to delete "${currentFilename}"?`;
    confirmationModal.style.display = 'flex';
});

// Close buttons for all modals
document.querySelectorAll('.close-button, #cancel-delete-button').forEach(btn => {
    btn.addEventListener('click', () => {
        newNoteModal.style.display = 'none';
        renameModal.style.display = 'none';
        confirmationModal.style.display = 'none';
        document.getElementById('url-modal').style.display = 'none';
    });
});

// Real logic for Create, Rename, Delete
const createNoteConfirm = document.getElementById('create-note-button');
createNoteConfirm.addEventListener('click', async () => {
    const title = document.getElementById('note-title').value;
    if (!title) return;
    try {
        const response = await fetch('/create_note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (response.ok) location.reload();
    } catch (error) {
        showToast('Error creating note', 'error');
    }
});

document.getElementById('rename-confirm-button').addEventListener('click', async () => {
    const newName = document.getElementById('new-filename').value;
    if (!newName) return;
    try {
        const response = await fetch(`/rename-file?oldFilename=${currentFilename}&newFilename=${newName}`);
        if (response.ok) location.reload();
    } catch (error) {
        showToast('Error renaming note', 'error');
    }
});

document.getElementById('confirm-delete-button').addEventListener('click', async () => {
    try {
        const response = await fetch(`/delete-file?filename=${currentFilename}`);
        if (response.ok) location.reload();
    } catch (error) {
        showToast('Error deleting note', 'error');
    }
});

// --- Link Extraction (Improved) ---
linkButton.addEventListener('click', () => {
    const text = quill.getText();
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    
    if (urls.length === 0) return showToast('No links found');
    
    const urlList = document.getElementById('url-list');
    urlList.innerHTML = '';
    
    [...new Set(urls)].forEach(url => {
        const div = document.createElement('div');
        div.className = 'url-item';
        div.innerHTML = `
            <span class="url-text">${url}</span>
            <div class="url-actions">
                <button class="icon-button" onclick="window.open('${url}', '_blank')"><i class="fas fa-external-link-alt"></i></button>
                <button class="icon-button" onclick="navigator.clipboard.writeText('${url}'); showToast('Copied!')"><i class="far fa-copy"></i></button>
            </div>
        `;
        urlList.appendChild(div);
    });
    
    document.getElementById('url-modal').style.display = 'flex';
});

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    if (isMobile) {
        document.body.classList.add('sidebar-collapsed');
    }
    initQuill();
    showDashboard();
});

// PWA Service Worker & Install Logic
let deferredPrompt;
const installButton = document.getElementById('sidebar-install-button');
const installModal = document.getElementById('install-modal');
const closeInstallModal = document.getElementById('close-install-modal');
const installConfirmButton = document.getElementById('install-confirm-button');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .catch(error => console.error('SWorker failed:', error));
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    if (installButton) {
        installButton.style.display = 'flex';
    }
});

if (installButton) {
    installButton.addEventListener('click', (e) => {
        e.preventDefault();
        installModal.style.display = 'flex';
    });
}

if (closeInstallModal) {
    closeInstallModal.addEventListener('click', () => {
        installModal.style.display = 'none';
    });
}

if (installConfirmButton) {
    installConfirmButton.addEventListener('click', async () => {
        installModal.style.display = 'none';
        if (!deferredPrompt) {
            showToast('Install prompt not available.', 'error');
            return;
        }
        
        // Show the prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installButton.style.display = 'none';
        }
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    if (installButton) installButton.style.display = 'none';
    deferredPrompt = null;
    showToast('App installed successfully!', 'success');
});
