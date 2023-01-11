import { inBrowser, inNode } from '../../_utils/browserOrNode'
import { switchToTheme } from '../../_utils/themeEngine'

const style = inBrowser() && document.getElementById('theGrayscaleStyle')

export function grayscaleObservers (enableGrayscale, instanceThemes, currentInstance) {
  if (inNode()) {
    return
  }

  enableGrayscale.subscribe(_enableGrayscale => {
    const _instanceThemes = instanceThemes.get()
    const theme = _instanceThemes && _instanceThemes[currentInstance.get()]
    style?.setAttribute('media', _enableGrayscale ? 'all' : 'only x') // disable or enable the style
    switchToTheme(theme, _enableGrayscale)
  })
}
