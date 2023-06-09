import { useRegisterSW } from 'virtual:pwa-register/svelte'
import { snackbar } from '../_components/snackbar/snackbar'
import { scheduleInterval } from './scheduleInterval'

export function registerServiceWorker() {
  let interval = null
  const delay = 1000 * 60 * 5 // 5 minutes

  function startPolling(registration) {
    if (registration.active.state === 'activated') {
      interval = scheduleInterval(
        () => {
          registration.update().catch(() => console.log('Network error, working in offline mode'))
        },
        delay,
        true
      )
    }
  }

  function stopPolling() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  useRegisterSW({
    onOfflineReady() {
      console.log('Working in offline mode')
    },
    onRegisterError(err) {
      console.log('Encountered an error when registering PWA service worker')
    },
    onRegisteredSW(_, registration) {
      startPolling(registration)

      async function skipWaiting() {
        const reg = await navigator.serviceWorker.getRegistration()
        if (!reg || !reg.waiting) {
          return
        }
        reg.waiting.postMessage('skip-waiting')
      }
      registration.addEventListener('updatefound', () => {
        stopPolling()

        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            snackbar.announce('intl.updateAvailable', 'intl.reload', async () => {
              await skipWaiting()
              document.location.reload()
            })
          }
        })
      })
    }
  })
}
