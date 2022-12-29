// modeled after https://github.com/andrewiggins/afterframe

import { inBrowser } from "./browserOrNode"

// see also https://github.com/WICG/requestPostAnimationFrame
const channel = inBrowser() && new MessageChannel()
const callbacks = []

if (inBrowser()) {
  channel.port1.onmessage = onMessage
}

function runCallback (callback) {
  try {
    callback()
  } catch (e) {
    console.error(e)
  }
}

function onMessage () {
  for (const callback of callbacks) {
    runCallback(callback)
  }
  callbacks.length = 0
}

function postMessage () {
  channel.port2.postMessage(undefined)
}

export const requestPostAnimationFrame = callback => {
  if (callbacks.push(callback) === 1) {
    requestAnimationFrame(postMessage)
  }
}
