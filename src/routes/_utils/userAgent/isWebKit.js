import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isWebKit = thunk(() => inBrowser() && typeof webkitIndexedDB !== 'undefined')
