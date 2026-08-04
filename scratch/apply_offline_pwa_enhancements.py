with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add offline i18n keys for all 7 languages
offline_i18n = [
    ('tr: {', 'tr: {\n                offlineAdMsg: "📡 Çevrimdışısınız! Ödüllü reklam izlemek için internet bağlantısı gerekiyor.",'),
    ('en: {', 'en: {\n                offlineAdMsg: "📡 You are offline! Internet connection required to watch rewarded ads.",'),
    ('de: {', 'de: {\n                offlineAdMsg: "📡 Du bist offline! Internetverbindung erforderlich, um Belohnungswerbung zu sehen.",'),
    ('fr: {', 'fr: {\n                offlineAdMsg: "📡 Vous êtes hors ligne! Connexion Internet requise pour regarder les publicités.",'),
    ('it: {', 'it: {\n                offlineAdMsg: "📡 Sei offline! Connessione Internet richiesta per guardare gli annunci.",'),
    ('es: {', 'es: {\n                offlineAdMsg: "📡 ¡Estás desconectado! Se requiere conexión a Internet para ver anuncios.",'),
    ('pt: {', 'pt: {\n                offlineAdMsg: "📡 Você está offline! Conexão com a Internet necessária para ver anúncios.",')
]

for old, new in offline_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Add offline check inside showRewardedAd
old_show_rewarded = """    showRewardedAd(onSuccess, onFailure) {
        // Production Check for Google AdMob H5 / Native Android Bridge"""

new_show_rewarded = """    showRewardedAd(onSuccess, onFailure) {
        // Offline Check: Notify player if internet connection is offline
        if (typeof navigator !== 'undefined' && navigator.onLine === false && !window.AndroidAdMob) {
            const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
            this.showToast(dict.offlineAdMsg || '📡 Çevrimdışısınız! Ödüllü reklam izlemek için internet bağlantısı gerekiyor.');
            if (onFailure) onFailure();
            return;
        }

        // Production Check for Google AdMob H5 / Native Android Bridge"""

if old_show_rewarded in js_content:
    js_content = js_content.replace(old_show_rewarded, new_show_rewarded, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Clean up sw.js fetch handler for 100% offline gameplay
new_sw_code = """const CACHE_NAME = 'esle-gitsin-3d-v4.2.0';
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

// Fetch Event - Network First with Instant Cache Fallback for 100% Offline Gameplay
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
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
"""

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(new_sw_code)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
