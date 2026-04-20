// Service Worker — cache app shell for offline launch, network-first for API
const CACHE_NAME = 'spinsheets-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Skip non-GET and API requests
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/')) return

  // Hashed assets: cache-first (immutable)
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return res
        })
      )
    )
    return
  }

  // Everything else: network-first with cache fallback
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone()
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
      return res
    }).catch(() => caches.match(e.request))
  )
})
