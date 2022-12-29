import { inNode } from '../../_utils/browserOrNode'
import { supportsFocusVisible } from '../../_utils/supportsFocusVisible'

export function focusRingObservers (alwaysShowFocusRing) {
  if (inNode()) {
    return
  }

  const styleId = supportsFocusVisible() ? 'theFocusVisibleStyle' : 'theFocusVisiblePolyfillStyle'
  const style = document.getElementById(styleId)

  alwaysShowFocusRing.subscribe(_alwaysShowFocusRing => {
    style.setAttribute('media', _alwaysShowFocusRing ? 'only x' : 'all') // disable or enable the style
  })
}
