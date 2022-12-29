import EventEmitter from 'events-light'
import { inBrowser } from './browserOrNode'

export const eventBus = new EventEmitter()

if (inBrowser()) {
  window.__eventBus = eventBus
}

export function on (eventName, callback) {
  eventBus.on(eventName, callback)
  return () => {
    eventBus.removeListener(eventName, callback)
  }
}

export const removeListener = eventBus.removeListener.bind(eventBus)

export const emit = eventBus.emit.bind(eventBus)
