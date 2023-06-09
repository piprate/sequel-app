// the page-lifecycle package causes some problems (doesn't work in node),
// and plus it's not needed immediately, so lazy-load it
import { importPageLifecycle } from './asyncModules/importPageLifecycle.js'
import { inBrowser } from './browserOrNode.js'

function addEventListener(event, func) {
  if (inBrowser() && !import.meta.env.VITE_IS_SERVICE_WORKER) {
    importPageLifecycle().then((lifecycle) => {
      lifecycle.addEventListener(event, func)
    })
  }
}

function removeEventListener(event, func) {
  if (inBrowser() && !import.meta.env.VITE_IS_SERVICE_WORKER) {
    importPageLifecycle().then((lifecycle) => {
      lifecycle.removeEventListener(event, func)
    })
  }
}

export const lifecycle = { addEventListener, removeEventListener }
