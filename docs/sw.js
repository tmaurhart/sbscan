const swCache = 'sbscan-v1';
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(swCache)
            .then(function (cache) {
                return cache.addAll([
                    '/sbscan/',
                    'index.html',
                    'favicon.ico',
                    'css/style.css',
                    'icons/favicon.ico',
                    'icons/android-chrome-192x192.png',
                    'icons/android-chrome-256x256.png',
                    'icons/android-chrome-512x512.png',
                    'icons/apple-touch-icon.png',
                    'icons/favicon-16x16.png',
                    'icons/favicon-32x32.png',
                    'icons/mstile-150x150.png',
                    'icons/safari-pinned-tab.svg',
                    'manifest.webmanifest'
                ]);
            })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== swCache) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(swCache).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});