import debounce from 'lodash-es/debounce'
import { inBrowser } from './browserOrNode'

const DEBOUNCE_DELAY = 700

const listeners = new Set()

if (inBrowser()) {
  window.__resizeListeners = listeners
}

if (inBrowser()) {
  window.addEventListener(
    'resize',
    debounce(() => {
      console.log('resize')
      listeners.forEach((listener) => listener())
    }, DEBOUNCE_DELAY)
  )
}

export function registerResizeListener(listener) {
  listeners.add(listener)
}

export function unregisterResizeListener(listener) {
  listeners.delete(listener)
}
