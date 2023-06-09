import { inBrowser, inNode } from '../../_utils/browserOrNode'
import { disableCustomScrollbars } from '../local'

const theScrollbarStyle = inBrowser() && document.getElementById('theScrollbarStyle')

export function customScrollbarObservers() {
  disableCustomScrollbars.subscribe((_disableCustomScrollbars) => {
    if (inNode()) {
      return
    }

    // disables or enables the style
    theScrollbarStyle.setAttribute('media', _disableCustomScrollbars ? 'only x' : 'all')
  })
}
