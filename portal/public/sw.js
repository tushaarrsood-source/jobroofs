// JOBROOFS Self-Clearing Service Worker
// Automatically flushes all stale cache storage and unregisters itself across all client browsers.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Pass-through fetch with zero cache interception
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
