const CACHE_NAME = 'biblical-planner-v1';
const ASSETS = [
  '/',
  '/Bible/index.html',
  '/Bible/dist/styles.css',
  '/Bible/js/script.js',
  '/Bible/manifest.json',
  '/Bible/icons/icon-192x192.png',
  '/Bible/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
