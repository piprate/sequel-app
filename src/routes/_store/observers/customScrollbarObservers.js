import { disableCustomScrollbars } from '../local'

const theScrollbarStyle = process.browser && document.getElementById('theScrollbarStyle')

export function customScrollbarObservers () {
  disableCustomScrollbars.subscribe(_disableCustomScrollbars => {
    if (!process.browser) {
      return
    }

    // disables or enables the style
    theScrollbarStyle.setAttribute('media', _disableCustomScrollbars ? 'only x' : 'all')
  });
}
