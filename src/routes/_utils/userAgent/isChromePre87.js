import { isChrome } from './isChrome'
import { thunk } from '../thunk'
import { inBrowser } from '../browserOrNode'

// https://caniuse.com/cookie-store-api
export const isChromePre87 = thunk(() => inBrowser() && isChrome() && typeof cookieStore === 'undefined')
