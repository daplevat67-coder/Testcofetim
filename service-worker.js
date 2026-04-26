self.addEventListener('install', e => {
  e.waitUntil(caches.open('coffee-v1').then(cache => {
    return cache.addAll(['./', './index.html', './style.css', './script.js']);
  }));
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});