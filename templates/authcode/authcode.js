
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

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default browser prompt
  e.preventDefault();

  // Store the event to show the custom prompt later
  deferredPrompt = e;

  // Show your custom install button or prompt
  // You can display this when it makes sense for your app
  showInstallButton();
});

// Function to show your custom install button
function showInstallButton() {
  const installButton = document.getElementById('install-button');

  if (installButton) {
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
      // Trigger the installation prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User dismissed the installation');
        }

        // Reset the deferred prompt
        deferredPrompt = null;
        installButton.style.display = 'none';
      });
    });
  }
}