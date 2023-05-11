import { inBrowser, inNode } from '../../_utils/browserOrNode'

const style = inBrowser() && document.getElementById('theGrayscaleStyle')

export function grayscaleObservers (enableGrayscale) {
  if (inNode()) {
    return
  }

  enableGrayscale.subscribe(_enableGrayscale => {
    style?.setAttribute('media', _enableGrayscale ? 'all' : 'only x') // disable or enable the style
  })
}
