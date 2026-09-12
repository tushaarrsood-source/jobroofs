'use client';

import { useEffect } from 'react';

/**
 * LiveSync guarantees that clients are always running the latest version of the app.
 * - Auto-purges stale browser cache storage.
 * - Automatically checks service worker updates and activates new revisions immediately.
 * - Detects server deployments in the background and transparently synchronizes the page
 *   without requiring the user to ever press refresh or reset manually.
 */
export function LiveSync() {
  useEffect(() => {
    // 1. Purge stale browser CacheStorage
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name).catch(() => {});
        });
      });
    }

    // 2. Service Worker registration with updateViaCache: 'none'
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          reg.update().catch(() => {});

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                  installing.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch(() => {});

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 3. Background server version synchronization
    let initialBuildId: string | null = null;

    const checkLiveVersion = async () => {
      try {
        const res = await fetch(`/api/version?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (!initialBuildId) {
            initialBuildId = data.buildId;
          } else if (data.buildId && data.buildId !== initialBuildId) {
            // New deployment detected on server — live sync automatically!
            window.location.reload();
          }
        }
      } catch {
        // Network offline or transient failure
      }
    };

    checkLiveVersion();
    const interval = setInterval(checkLiveVersion, 8000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        checkLiveVersion();
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((reg) => reg?.update().catch(() => {}));
        }
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  return null;
}
