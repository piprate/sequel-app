import { badgeNumber } from '../badge'
import { isChromePre87 } from '../../_utils/userAgent/isChromePre87'
import { inNode } from '../../_utils/browserOrNode'

export function badgeObservers () {
  if (inNode()) {
    return
  }
  // Chrome 86 on Linux in Circle CI seems to hang just by checking for this... not worth supporting.
  if (isChromePre87() || !('setAppBadge' in navigator)) {
    return
  }
  badgeNumber.subscribe(_badgeNumber => {
    if (_badgeNumber) {
      navigator.setAppBadge(_badgeNumber)
    } else {
      navigator.clearAppBadge()
    }
  })
}
