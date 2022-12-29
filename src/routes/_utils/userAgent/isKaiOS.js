import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isKaiOS = thunk(() => inBrowser() && /KAIOS/.test(navigator.userAgent))
