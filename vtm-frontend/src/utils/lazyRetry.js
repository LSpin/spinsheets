import { lazy } from 'react'

// Retry failed lazy imports once (handles stale chunk hashes after deploys)
export default function lazyRetry(fn) {
  return lazy(() => fn().catch(() => {
    const reloaded = sessionStorage.getItem('chunk_reload')
    if (!reloaded) {
      sessionStorage.setItem('chunk_reload', '1')
      window.location.reload()
    }
    sessionStorage.removeItem('chunk_reload')
    return fn()
  }))
}
