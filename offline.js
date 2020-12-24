// Get Cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open("Tombola v2.0").then(function(cache) {
      return cache.addAll(
        [
          // Main App
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          // 404 Error
          '/404',
          '/404.html',
          // Privacy Policy
          '/privacy/',
          '/privacy/index.html',
          // Favicons
          '/site.webmanifest',
          '/safari-pinned-tab.svg',
          '/favicon-16x16.png',
          '/favicon-32x32.png',
          '/favicon.ico',
          '/android-chrome-192x192.png',
          '/android-chrome-512x512.png',
          '/touch-icon-iphone.png',
          '/touch-icon-ipad.png',
          '/touch-icon-iphone-retina.png',
          '/touch-icon-ipad-retina.png'
        ]
      );
    })
  );
});
// Serve Cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});