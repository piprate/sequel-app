import { onUserIsLoggedOut } from '../../_actions/onUserIsLoggedOut'
import { inNode } from '../../_utils/browserOrNode'

export function logOutObservers(isUserLoggedIn) {
  if (inNode()) {
    return
  }
  isUserLoggedIn.subscribe((loggedIn) => {
    if (loggedIn) {
      onUserIsLoggedOut()
    }
  })
}
