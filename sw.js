// Offline support for the staging trainer.
//
// NETWORK-FIRST, deliberately. A cache-first worker would keep serving an old
// copy of the staging rules after a correction is published, and this app makes
// clinical-teaching claims that must be correctable the moment they are fixed.
// So: always try the network, fall back to cache only when offline.
const CACHE = 'hn-staging-v4';
const ASSETS = [
  './', './index.html', './app.js', './engine.js',
  './data/sites.js', './data/common.js', './data/survival.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html')))
  );
});
