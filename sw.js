// Machine PM System — Service Worker
// Version bump here to force cache refresh
const CACHE_NAME = 'pm-system-v1';

const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // External CDN resources cached on first load
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'
];

// ── INSTALL: pre-cache core assets ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local files strictly; external CDN best-effort
      const local = PRECACHE_URLS.filter(u => u.startsWith('./'));
      const external = PRECACHE_URLS.filter(u => !u.startsWith('./'));

      return Promise.all([
        cache.addAll(local),
        ...external.map(url =>
          fetch(url, { mode: 'no-cors' })
            .then(res => cache.put(url, res))
            .catch(() => { /* ignore if offline at install */ })
        )
      ]);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ───────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for assets, network-first for API ─────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // GitHub API — always network, fallback to cache
  if (url.hostname === 'api.github.com') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts / CDN — stale-while-revalidate
  if (url.hostname.includes('googleapis') || url.hostname.includes('cloudflare')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const network = fetch(event.request).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Everything else — cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      });
    })
  );
});

// ── BACKGROUND SYNC: push pending data when back online ──────────
self.addEventListener('sync', event => {
  if (event.tag === 'pm-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(c => c.postMessage({ type: 'SYNC_REQUEST' }));
      })
    );
  }
});
