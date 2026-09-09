const CACHE_NAME = 'esle-gitsin-3d-v8.9.92';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './leaderboard.json',
  './manifest.json',
  './favicon.ico',
  './favicon.png',
  './icons/app-icon-192.png',
  './icons/app-icon-512.png',
  './icons/app-maskable-512.png',
  './icons/app-apple-icon.png',
  './audio/cybercore_sound_2_hollywood.wav',
  './audio/carefree.mp3',
  './audio/fluffing_a_duck.mp3',
  './audio/monkeys.mp3',
  './images/app_hero_icon.png',
  './images/cat.jpg',
  './images/fox.jpg',
  './images/panda.jpg',
  './images/dragon.jpg',
  './images/shiba.jpg',
  './images/unicorn.jpg',
  './images/lion.jpg',
  './images/bunny.jpg',
  './images/owl.jpg',
  './images/red_panda.jpg',
  './images/frog.jpg',
  './images/penguin.jpg'
];

// Install Event - Pre-cache core files with individual safety & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        ASSETS_TO_CACHE.map(async (asset) => {
          try {
            const response = await fetch(asset, { cache: 'reload' });
            if (response && response.ok) {
              await cache.put(asset, response);
            }
          } catch (err) {
            console.warn('[SW] Precache item failed:', asset, err);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate Event - Purge ALL old caches & claim clients instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Cache First with ignoreSearch for 100% Instant Offline Play
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = event.request.url.toLowerCase();

  // EXPLICITLY BYPASS SERVICE WORKER CACHE FOR LIVE CLOUD DATABASE API REQUESTS & VERSION CHECK!
  if (reqUrl.includes('jsonblob') || reqUrl.includes('mongodb') || reqUrl.includes('/api/') || reqUrl.includes('version.json')) {
    return;
  }

  // Navigation Request (Opening the page)
  const isNavigation = event.request.mode === 'navigate' ||
                       (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true }).then((cachedIndex) => {
        // Fast network fetch with 1.2s timeout for online updates, fallback to cache
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', resClone));
            }
            return networkResponse;
          })
          .catch(() => cachedIndex);

        // If we have a cached index, return it immediately if offline, or wait up to 1200ms
        if (cachedIndex) {
          return Promise.race([
            networkFetch,
            new Promise((resolve) => setTimeout(() => resolve(cachedIndex), 1200))
          ]);
        }
        return networkFetch;
      })
    );
    return;
  }

  // Static Assets & Cross-Origin Fonts:
  // For JS and CSS, respect version query parameters (?v=...) to ensure live updates download immediately!
  const isScriptOrStyle = reqUrl.includes('.js') || reqUrl.includes('.css');
  const matchOptions = isScriptOrStyle ? {} : { ignoreSearch: true };

  event.respondWith(
    caches.match(event.request, matchOptions).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-While-Revalidate in background if online
        if (navigator.onLine) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const resClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      // Not cached yet - fetch from network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // NEVER return index.html for non-navigation assets!
          return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
        });
    })
  );
});
