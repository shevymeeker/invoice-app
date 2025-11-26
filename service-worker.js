/**
 * Service Worker for Offline Functionality
 * Owensboro Mowing Company Invoice App
 * FIXED: Added PDF Library caching & Relative Paths
 */

const CACHE_NAME = 'omc-invoice-app-v2'; // Incremented version to force update

// ⚠️ CRITICAL: We added the PDF library here so it works offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png', 
  './icons/icon-512x512.png',
  // The Engine that generates PDFs (MUST BE CACHED)
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' 
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing & Caching PDF Engine...');
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
