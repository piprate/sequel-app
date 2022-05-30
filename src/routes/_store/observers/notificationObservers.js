import { setFavicon } from '../../_utils/setFavicon'
import { runMediumPriorityTask } from '../../_utils/runMediumPriorityTask'
import { hasNotifications } from '../badge'

let currentFaviconHasNotifications = false

export function notificationObservers() {
  hasNotifications.subscribe(_hasNotifications => {
    if (!process.browser) {
      return
    }
    runMediumPriorityTask(() => {
      if (currentFaviconHasNotifications === _hasNotifications) {
        return
      }
      setFavicon(_hasNotifications ? '/favicon-alert.png' : '/favicon.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  });
}
