/**
 * Service Worker for Offline Functionality
 * Owensboro Mowing Company Invoice App
 * FIXED: Caches PDF Engine & Your Specific Icon
 */

const CACHE_NAME = 'omc-invoice-app-v4'; // Version up to force refresh (v4: offline-first with local jsPDF)

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // This is the exact filename you uploaded:
  './icon-watchos-129x129@2x.png',
  // The PDF Engine (now bundled locally - no internet required!)
  './vendor/jspdf.umd.min.js'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing & Caching Assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache First Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
