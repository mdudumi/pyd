--- **sw.js** ---
const CACHE_NAME = 'biblical-planner-v1';
const ASSETS = ['/', '/index.html', '/css/styles.css', '/js/script.js', 'json/manifest.json', '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
