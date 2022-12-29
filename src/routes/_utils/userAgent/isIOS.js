import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isIOS = thunk(() => inBrowser() && /iP(?:hone|ad|od)/.test(navigator.userAgent))
