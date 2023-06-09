import { onlineObservers } from './onlineObservers'
import { nowObservers } from './nowObservers'
// import { navObservers } from './navObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'
import { resizeObservers } from './resizeObservers'
import { setupLoggedInObservers } from './setupLoggedInObservers'
import { logOutObservers } from './logOutObservers'
import { touchObservers } from './touchObservers'
import { grayscaleObservers } from './grayscaleObservers'
import { focusRingObservers } from './focusRingObservers'
import { leftRightFocusObservers } from './leftRightFocusObservers'

export function setupObservers(
  alwaysShowFocusRing,
  isUserLoggedIn,
  online,
  pageVisibilityHidden,
  enableGrayscale,
  leftRightChangesFocus
) {
  onlineObservers(online)
  nowObservers()
  // navObservers();
  pageVisibilityObservers(pageVisibilityHidden)
  resizeObservers()
  touchObservers()
  logOutObservers(isUserLoggedIn)
  focusRingObservers(alwaysShowFocusRing)
  grayscaleObservers(enableGrayscale)
  leftRightFocusObservers(leftRightChangesFocus)
  setupLoggedInObservers(isUserLoggedIn)
}
