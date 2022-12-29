import LoadingMask from '../_components/LoadingMask.svelte'
import { inBrowser } from './browserOrNode'

let loadingMask

if (inBrowser()) {
  loadingMask = new LoadingMask({
    target: document.querySelector('#loading-mask')
  })
  if (!import.meta.env.PROD) {
    window.loadingMask = loadingMask // for debugging
  }
} else {
  loadingMask = {}
}

export { loadingMask }
