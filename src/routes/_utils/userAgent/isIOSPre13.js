// PointerEvent introduced in iOS 13 https://caniuse.com/#feat=pointer
import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'
import { isIOS } from '../userAgent/isIOS'

export const isIOSPre13 = thunk(() => inBrowser() && isIOS() &&
  !(typeof PointerEvent === 'function' &&
    PointerEvent.toString().includes('[native code]')))
