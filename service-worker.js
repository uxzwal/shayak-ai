/**
 * Sahayak AI - Service Worker
 * Enables offline functionality and PWA capabilities
 */

const CACHE_NAME = 'sahayak-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/index.css',
  '/App.js',
  '/protocols.js',
  '/agentLogic.js',
  '/storage.js',
  '/EmergencyGrid.jsx',
  '/AgentChat.jsx',
  '/ResultCard.jsx',
  '/manifest.json'
];

/**
 * Install event - cache all assets
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        // Don't fail installation if some files can't be cached
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event - network-first with cache fallback
 * This ensures the app works offline using cached assets
 */
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then(response => {
        // Cache successful responses for offline use
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache if network fails
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          
          // Return offline page if asset not found
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

/**
 * Background sync for future feature: saving sessions to cloud
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-sessions') {
    event.waitUntil(
      // This would sync session data if network becomes available
      Promise.resolve()
    );
  }
});

/**
 * Push notification for emergency reminders (future feature)
 */
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Emergency Response Reminder',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%233b82f6" width="192" height="192"/><text x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle">🚑</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><text x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle">🚑</text></svg>',
    tag: 'emergency-alert',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Sahayak AI', options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Open app if not already open
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

/**
 * Message handler for communication with app
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Sahayak AI Service Worker loaded');
