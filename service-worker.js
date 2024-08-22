self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('imemo-cache').then((cache) => {
      return cache.addAll([
        '/', // Cache the root path
        '/templates/authcode.html', // Cache the login page
        '/templates/memo.html', // Cache the memo page
        '/static/sticky-note.png', // Cache the image
        // Add more paths as needed, ensure they are relative to the root directory
      ]).catch((error) => {
        console.error('Cache addAll error:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});