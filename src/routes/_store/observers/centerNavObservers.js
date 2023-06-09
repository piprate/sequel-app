import { inBrowser, inNode } from '../../_utils/browserOrNode'
import { centerNav } from '../local'

const centerNavStyle = inBrowser() && document.getElementById('theCenterNavStyle')

export function centerNavObservers() {
  centerNav.subscribe((_centerNav) => {
    if (inNode()) {
      return
    }

    // disables or enables the style
    centerNavStyle.setAttribute('media', _centerNav ? 'all' : 'only x')
  })
}
