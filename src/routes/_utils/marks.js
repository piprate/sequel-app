import { inBrowser } from "./browserOrNode"

const enabled = inBrowser() && performance.mark && (
  !import.meta.env.PROD ||
  (typeof location !== 'undefined' && location.search.includes('marks=true'))
)

const perf = inBrowser() ? performance : null

export function mark (name) {
  if (enabled) {
    perf?.mark(`start ${name}`)
  }
}

export function stop (name) {
  if (enabled) {
    perf?.mark(`end ${name}`)
    perf?.measure(name, `start ${name}`, `end ${name}`)
  }
}
