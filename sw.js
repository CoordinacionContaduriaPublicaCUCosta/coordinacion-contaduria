const CACHE = 'coord-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contacto.html',
  '/chat.html',
  '/style.css',
  '/script.js',
  '/data.json'
];

self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event=>{
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(fetchResp => {
        return caches.open(CACHE).then(cache => {
          cache.put(event.request, fetchResp.clone());
          return fetchResp;
        });
      }).catch(()=> caches.match('/index.html'));
    })
  );
});
