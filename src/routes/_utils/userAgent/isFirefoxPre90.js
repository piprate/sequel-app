import { inBrowser } from '../browserOrNode'
import { thunk } from '../thunk'

export const isFirefoxPre90 = thunk(() => {
  return inBrowser() &&
    // https://stackoverflow.com/a/9851769/680742
    typeof InstallTrigger !== 'undefined' &&
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at#browser_compatibility
    !Array.prototype.at
})
