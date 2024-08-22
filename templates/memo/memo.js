const noteLinks = document.querySelectorAll('.note-link');
  const notepadTextarea = document.getElementById('note-textarea');
  const newNoteButton = document.getElementById('new-note-button');
  const saveButton = document.getElementById('save-button');
  const isMobile = window.matchMedia("(max-width: 500px)").matches;
  const showSidebarButton = document.getElementById('show-sidebar-button');
  const hideSidebarButton = document.getElementById('hide-sidebar-button');
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('top-bar')
  const content = document.getElementById('content');

  function saveContent(content, filename) {
      return fetch(`/save-file?filename=${filename}`, {
          method: 'POST',
          body: content,
      })
          .then((response) => {
              if (response.ok) {
                  console.log('Auto-save successful.');
                  return true;
              } else {
                  console.error('Auto-save failed.');
                  return false;
              }
          })
          .catch((error) => {
              console.error('Error saving file:', error);
              return false;
          });
  }

  function showAutosaveFailedPopup() {
      const autosaveFailedPopup = document.getElementById('autosave-failed-popup');
      autosaveFailedPopup.style.display = 'block';
  }

  function hideAutosaveFailedPopup() {
      const autosaveFailedPopup = document.getElementById('autosave-failed-popup');
      autosaveFailedPopup.style.display = 'none';
  }

  const closeAutosaveFailedButton = document.getElementById('close-autosave-failed-popup');
  closeAutosaveFailedButton.addEventListener('click', hideAutosaveFailedPopup);

  window.addEventListener('online', () => {

      hideAutosaveFailedPopup();
  });

  window.addEventListener('offline', () => {
      // When the internet connection is lost (offline), show the popup
      showAutosaveFailedPopup();
  });

  notepadTextarea.addEventListener('input', (e) => {
      const content = e.target.value;

      if (currentFilename) {
          saveContent(content, currentFilename)
              .then((success) => {
                  if (!success) {
                      showAutosaveFailedPopup();
                  }
              });
      }
  });

  let currentFilename = null; 

  function setPageTitle(filename) {
      const nameWithoutExtension = filename.replace('.txt', '');
      document.title = `imemo - ${nameWithoutExtension}`;
  }

  function focusContent(){
    if (isMobile){
      content.style.display = 'block'
      sidebar.style.transform = 'translateX(-500px)'; 
      content.style.marginLeft = '0'; 
      showSidebarButton.style.display = 'block';
      if (isMobile){
        topbar.style.display='block'
        topbar.style.display='flex'
      }
    }

  }

  function highlightSelectedLink(link) {

      try {
        noteLinks.forEach((element) => {
            element.classList.remove('selected-link');
        });

        link.classList.add('selected-link');
        const fileIcon = link.querySelector('.fab.fa-pagelines');
        fileIcon.classList.remove('fab', 'fa-pagelines');
        fileIcon.classList.add('fa-solid', 'fa-spinner', 'fa-spin');

      } catch (error) {
        removeLoading(link)
        highlightSelectedLink(link);
      }


  }

  function removeLoading(link) {  

      const fileIcon = link.querySelector('.fa-solid.fa-spinner.fa-spin');
      fileIcon.classList.remove('fa-solid', 'fa-spinner', 'fa-spin');
      fileIcon.classList.add('fab', 'fa-pagelines');
      
  }

  noteLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
          e.preventDefault();

          const filename = link.getAttribute('data-filename');
          highlightSelectedLink(link);
          fetch(`/load-file?filename=${filename}`)
              .then((response) => response.text())
              .then((content) => {

                  notepadTextarea.value = content;
                  currentFilename = filename; // Update the current file
                  setPageTitle(filename);
                  focusContent();
                  removeLoading(link)
              })
              .catch((error) => {
                  console.error('Error loading file:', error);
              });
      });
  });

  newNoteButton.addEventListener('click', (e) => {
      e.preventDefault();
  });

  saveButton.addEventListener('click', () => {
      const content = notepadTextarea.value;
      if (currentFilename) {
          // Save the content to the currently loaded file
          fetch(`/save-file?filename=${currentFilename}`, {
              method: 'POST',
              body: content,
          })
              .then((response) => {
                  if (response.ok) {
                      alert('File saved successfully.');
                  } else {
                      alert('Error saving file.');
                  }
              })
              .catch((error) => {
                  console.error('Error saving file:', error);
              });
      }
  });

  const newNoteModal = document.getElementById('new-note-modal');
  const createNoteButton = document.getElementById('create-note-button');
  const closeModalButton = document.getElementById('close-modal');

  newNoteButton.addEventListener('click', () => {
      newNoteModal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', () => {
      newNoteModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === newNoteModal) {
          newNoteModal.style.display = 'none';
      }
  });

createNoteButton.addEventListener('click', () => {
    const title = document.getElementById('note-title').value;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/create_note', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const data = JSON.stringify({ title: title });

    xhr.send(data);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // File created successfully on the server
            document.getElementById('note-title').value = '';
            newNoteModal.style.display = 'none';
            // Refresh the page to load the new file
            location.reload();
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            // Handle any error that occurred during file creation
            alert('Error creating note. Please try again.');
        }
    };
  });

  showSidebarButton.addEventListener('click', () => {
      sidebar.style.transform = 'translateX(0)';
      content.style.marginLeft = '230px'; 
      showSidebarButton.style.display = 'none';
      content.style.display = 'block'
      if (isMobile){
        topbar.style.display='none'
      }
  });

  hideSidebarButton.addEventListener('click', () => {
      content.style.display = 'block'
      sidebar.style.transform = 'translateX(-500px)'; 
      content.style.marginLeft = '0'; 
      showSidebarButton.style.display = 'block';
      if (isMobile){
        topbar.style.display='block'
        topbar.style.display='flex'
      }

  });

  document.getElementById('note-textarea').addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // Insert a tab character at the caret position
        document.execCommand('insertText', false, '\t');

        // Put caret at the right position again
        this.selectionStart = this.selectionEnd = start + 1;
      }
  });

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
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

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

  function openRenameModal() {
      const renameModal = document.getElementById('rename-modal');
      renameModal.style.display = 'block';

      const currentFilenameElement = document.querySelector('.selected-link');
      const currentFilename = currentFilenameElement.textContent.trim();

      const newFilenameInput = document.getElementById('new-filename');
      newFilenameInput.value = currentFilename;
  }

  function closeRenameModal() {
      const renameModal = document.getElementById('rename-modal');
      renameModal.style.display = 'none';
  }

  const renameButton = document.getElementById('rename-button');
  renameButton.addEventListener('click', openRenameModal);

  const closeRenameModalButton = document.getElementById('close-rename-modal');
  closeRenameModalButton.addEventListener('click', closeRenameModal);

  const renameConfirmButton = document.getElementById('rename-confirm-button');
  renameConfirmButton.addEventListener('click', () => {
      const newFilenameInput = document.getElementById('new-filename');
      const newFilename = newFilenameInput.value.trim();

      if (newFilename !== "") {
          // Send a request to the server to rename the file
          fetch(`/rename-file?oldFilename=${currentFilename}&newFilename=${newFilename}`)
              .then((response) => {
                  if (response.ok) {
                      alert('File renamed successfully.');
                      closeRenameModal();
                      // Reload the page to reflect the renamed file
                      location.reload();
                  } else {
                      alert('Error renaming file.');
                  }
              })
              .catch((error) => {
                  console.error('Error renaming file:', error);
              });
      } else {
          alert('Please enter a valid filename.');
      }
  });

  function openConfirmationPopup(filename) {
      const confirmationModal = document.getElementById('confirmation-modal');
      confirmationModal.style.display = 'block';

      const confirmationMessage = document.getElementById('confirmation-message');
      confirmationMessage.textContent = `Are you sure you want to delete "${filename}"? This action cannot be undone.`;
  }

  function closeConfirmationPopup() {
      const confirmationModal = document.getElementById('confirmation-modal');
      confirmationModal.style.display = 'none';
  }

  const deleteButton = document.getElementById('delete-button');
  deleteButton.addEventListener('click', () => {
      const currentFilenameElement = document.querySelector('.selected-link');
      if (!currentFilenameElement) {
          alert('No file selected to delete.');
          return;
      }

      const currentFilename = currentFilenameElement.getAttribute('data-filename');
      openConfirmationPopup(currentFilename);
  });

  const confirmDeleteButton = document.getElementById('confirm-delete-button');
  confirmDeleteButton.addEventListener('click', () => {
      const currentFilenameElement = document.querySelector('.selected-link');
      closeConfirmationPopup();
      if (!currentFilenameElement) {
          alert('No file selected to delete.');
          closeConfirmationPopup();
          return;
      }

      const currentFilename = currentFilenameElement.getAttribute('data-filename');

      fetch(`/delete-file?filename=${currentFilename}`)
          .then((response) => {
              if (response.ok) {
                  closeConfirmationPopup();
                  alert('File deleted successfully.');
                  // Reload the page to reflect the deleted file
                  location.reload();
              } else {
                  alert('Error deleting file.');
              }
          })
          .catch((error) => {
              console.error('Error deleting file:', error);
          });
  });

  const cancelDeleteButton = document.getElementById('cancel-delete-button');
  cancelDeleteButton.addEventListener('click', closeConfirmationPopup);

  const closeConfirmationModalButton = document.getElementById('close-confirmation-modal');
  closeConfirmationModalButton.addEventListener('click', closeConfirmationPopup);

  function refreshPage() {
      location.reload();
  }

  const syncButton = document.getElementById('sync-button');
  syncButton.addEventListener('click', refreshPage);

  const linkButton = document.getElementById('link-button');

  linkButton.addEventListener('click', () => {
      const noteContent = notepadTextarea.value;
      const urls = extractURLs(noteContent);

      if (urls.length > 0) {
          showURLModal(urls);
      } else {
          alert('No URLs found in the note.');
      }
  });

  function extractURLs(text) {
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
  }

  function showURLModal(urls) {
      const urlModal = document.getElementById('url-modal');
      const urlList = document.getElementById('url-list');

      urlList.innerHTML = ''; // Clear the URL list

      urls.forEach(url => {
          const urlItem = document.createElement('div');
          urlItem.className = 'url-item';
          urlItem.innerHTML = `
              <span style="flex-grow: 1;">${url}</span>
              <button class="url-button" onclick="copyURL('${url}')">
                  <i class="far fa-copy"></i>
              </button>
              <button class="url-button" onclick="openURL('${url}')">
                  <i class="fas fa-external-link-alt"></i>
              </button>
          `;
          urlList.appendChild(urlItem);
      });

      urlModal.style.display = 'block';
  }

  function closeURLModal() {
      const urlModal = document.getElementById('url-modal');
      urlModal.style.display = 'none';
  }

  function copyURL(url) {
      if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
              .then(() => {
                  alert('URL copied to clipboard: ' + url);
              })
              .catch(err => {
                  console.error('Failed to copy URL: ', err);
                  alert('Failed to copy URL. You can manually copy the URL: ' + url);
              });
      } else {
          alert('Clipboard API is not supported in your browser. You can manually copy the URL: ' + url);
      }
  }

  function openURL(url) {
      // Open the URL in a new tab/window
      window.open(url, '_blank');
  }