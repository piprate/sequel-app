import { onUserIsLoggedOut } from '../../_actions/onUserIsLoggedOut'

export function logOutObservers(isUserLoggedIn) {
  if (!process.browser) {
    return
  }
  isUserLoggedIn.subscribe(loggedIn => {
    if (loggedIn) {
      onUserIsLoggedOut()
    }
  });
}
