import EventEmitter from 'events-light'

export const eventBus = new EventEmitter()

if (process.browser) {
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
