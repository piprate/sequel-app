import { centerNav } from '../local'

const centerNavStyle = process.browser && document.getElementById('theCenterNavStyle')

export function centerNavObservers () {
  centerNav.subscribe(_centerNav => {
    if (!process.browser) {
      return
    }

    // disables or enables the style
    centerNavStyle.setAttribute('media', _centerNav ? 'all' : 'only x')
  })
}
