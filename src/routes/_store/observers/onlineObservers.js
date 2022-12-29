import debounce from 'lodash-es/debounce'
import { toast } from '../../_components/toast/toast'
import { inBrowser, inNode } from '../../_utils/browserOrNode'

const OFFLINE_DELAY = 5000
const NOTIFY_OFFLINE_LIMIT = 1

let notifyCount = 0

// debounce to avoid notifying for a short connection issue
const notifyOffline = debounce(() => {
  if (inBrowser() && !navigator.onLine && ++notifyCount <= NOTIFY_OFFLINE_LIMIT) {
    toast.say('intl.youAreOffline')
  }
}, OFFLINE_DELAY)

export function onlineObservers (online) {
  if (inNode()) {
    return
  }

  online.subscribe(_online => {
    if (!_online) {
      notifyOffline()
    }
  })

  window.addEventListener('offline', () => online.set(false))
  window.addEventListener('online', () => online.set(true))
}
