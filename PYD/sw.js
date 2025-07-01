const CACHE_NAME = 'pyd-planner-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/js/script.js',
  '/manifest.json',
  '/icon/icon-192.png',
  '/icon/icon-512.png',
  // include any CSS or other static files
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});