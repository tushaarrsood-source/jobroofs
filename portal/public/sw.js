// JOBROOFS PWA Service Worker
// Network-first pass-through ensuring always live data while fulfilling PWA installation criteria
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Network-first pass-through with zero stale caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Offline fallback if network is completely unavailable
      return new Response('JOBROOFS ist offline. Bitte überprüfe deine Internetverbindung.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});
