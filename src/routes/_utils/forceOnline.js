import { online } from '../_store/local'
import { inBrowser } from './browserOrNode'
import { emit } from './eventBus'

// Force online/offline state. Needed for integration tests.
// It would be nice not to actually ship this in production, but *shrug*
if (inBrowser()) {
  const globalFetch = window.fetch

  window.__forceOnline = onlineVal => {
    online.set(onlineVal)

    if (onlineVal) {
      window.fetch = globalFetch
      emit('forcedOnline', true)
    } else {
      window.fetch = () => Promise.reject(new Error('force offline'))
      emit('forcedOnline', false)
    }
  }
}
