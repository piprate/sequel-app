import { currentSpark } from '../instance'
import { currentPage } from '../navigation'
import { showComposeDialog } from '../../_actions/showComposeDialog'

// If the user is logged in, and if the Service Worker handled a POST and set special data
// in IndexedDB, then we want to handle it on the home page.
export function showComposeDialogObservers () {
  let observedOnce = false
  currentSpark.subscribe(async currentSpark => {
    if (currentSpark && !observedOnce) {
      // when the currentSpark object is available, we can check to see
      // if the user is trying to share something (or we got here from a shortcut), then share it
      observedOnce = true
      if (currentPage.get() === 'home' && new URLSearchParams(location.search).get('compose') === 'true') {
        await showComposeDialog()
      }
    }
  })
}
