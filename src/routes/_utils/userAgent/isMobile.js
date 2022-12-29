import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isMobile = thunk(() => inBrowser() && navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|KAIOS)/))
