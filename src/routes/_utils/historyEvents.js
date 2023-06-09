// hacky way to listen for pushState/replaceState changes
// per https://stackoverflow.com/a/25673911/680742

import { inBrowser } from './browserOrNode'

function wrapper(type) {
  const orig = history[type]
  return function () {
    const result = orig.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return result
  }
}

if (inBrowser()) {
  history.pushState = wrapper('pushState')
  history.replaceState = wrapper('replaceState')
}
