// IntersectionObserver introduced in iOS 12.2 https://caniuse.com/#feat=intersectionobserver
import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'
import { isIOS } from '../userAgent/isIOS'

export const isIOSPre12Point2 = thunk(() => inBrowser() && isIOS() &&
  !(typeof IntersectionObserver === 'function' &&
    IntersectionObserver.toString().includes('[native code]')))
