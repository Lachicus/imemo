
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
}

const submitButton = document.getElementById("submitButton");

// Define a function that will be executed when the button is clicked
function submitButtonClick() {
  document.getElementById('authenticating').style.display = 'block';
}

// Attach a click event listener to the button
submitButton.addEventListener("click", submitButtonClick);

let deferredPrompt;
const installButton = document.getElementById('install-button');
const installModal = document.getElementById('install-modal');
const closeInstallModal = document.getElementById('close-install-modal');
const installConfirmButton = document.getElementById('install-confirm-button');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
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
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      if (installButton) installButton.style.display = 'none';
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  if (installButton) installButton.style.display = 'none';
  deferredPrompt = null;
});