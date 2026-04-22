// Service Worker — cache app shell for offline launch, network-first for API
const CACHE_NAME = 'spinsheets-v2'

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

  // Skip non-GET, API requests, and browser extensions
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.origin !== self.location.origin) return

  // Hashed assets (/assets/): cache-first (immutable, fingerprinted filenames)
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          }
          return res
        }).catch(() => caches.match(e.request).then(r => r || new Response('', { status: 503 })))
      )
    )
    return
  }

  // SPA navigation routes: network-first, fallback to cached index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put('/', clone))
        }
        return res
      }).catch(() => caches.match('/').then(r => r || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/html' } })))
    )
    return
  }

  // Other static files: network-first with cache fallback
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
      }
      return res
    }).catch(() => caches.match(e.request).then(r => r || new Response('', { status: 503 })))
  )
})
