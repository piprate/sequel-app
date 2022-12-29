import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isChrome = thunk(() => inBrowser() && /Chrome/.test(navigator.userAgent))
