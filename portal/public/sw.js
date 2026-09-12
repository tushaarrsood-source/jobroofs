// JOBROOFS PWA Service Worker — Always live, zero stale caching
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Purge all caches to guarantee always live sync
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-first with no-store navigation, never serving stale HTML
self.addEventListener('fetch', (event) => {
  // Never intercept API routes
  if (event.request.url.includes('/api/')) {
    return;
  }

  // For HTML navigation: always force fresh network request
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return new Response('JOBROOFS ist offline. Bitte überprüfe deine Internetverbindung.', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('JOBROOFS ist offline.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});
