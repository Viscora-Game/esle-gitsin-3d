const CACHE_NAME = 'esle-gitsin-3d-v110';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './favicon.ico',
  './favicon.png',
  './icons/app-icon-192.png',
  './icons/app-icon-512.png',
  './icons/app-maskable-512.png',
  './icons/app-apple-icon.png',
  './images/app_hero_icon.png'
];

// Install Event - Pre-cache core files & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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

// Fetch Event - NETWORK FIRST with Cache Fallback for instant live updates!
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same origin or GitHub Pages assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network fetch succeeds, update cache in background & return fresh response
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline or network fails, fall back to cached version
        return caches.match(event.request);
      })
  );
});
