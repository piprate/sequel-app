import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isMac = thunk(() => inBrowser() && /mac/i.test(navigator.platform))
