import { supportsFocusVisible } from '../../_utils/supportsFocusVisible'

export function focusRingObservers(alwaysShowFocusRing) {
  if (!process.browser) {
    return
  }

  const styleId = supportsFocusVisible() ? 'theFocusVisibleStyle' : 'theFocusVisiblePolyfillStyle'
  const style = document.getElementById(styleId)

  alwaysShowFocusRing.subscribe(_alwaysShowFocusRing => {
    style.setAttribute('media', _alwaysShowFocusRing ? 'only x' : 'all') // disable or enable the style
  });
}
