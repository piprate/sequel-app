// svelte helper to add a .once() method similar to .on, but only fires once
import { on, removeListener } from './eventBus'

export function once(eventName, callback) {
  const listener = (eventValue) => {
    removeListener(eventName, listener)
    callback(eventValue)
  }
  on(eventName, listener)
}
