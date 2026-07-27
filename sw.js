const CACHE_NAME = 'esle-gitsin-3d-v3.9.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './favicon.ico',
  './favicon.png',
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

// Fetch Event - NETWORK FIRST for live updates
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
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
        return caches.match(event.request);
      })
  );
});
        // If offline or network fails, fall back to cached version
        return caches.match(event.request);
      })
  );
});
