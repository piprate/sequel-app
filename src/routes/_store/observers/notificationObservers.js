import { setFavicon } from '../../_utils/setFavicon'
import { runMediumPriorityTask } from '../../_utils/runMediumPriorityTask'
import { hasNotifications } from '../badge'
import { inNode } from '../../_utils/browserOrNode'

let currentFaviconHasNotifications = false

export function notificationObservers () {
  hasNotifications.subscribe(_hasNotifications => {
    if (inNode()) {
      return
    }
    runMediumPriorityTask(() => {
      if (currentFaviconHasNotifications === _hasNotifications) {
        return
      }
      setFavicon(_hasNotifications ? '/favicon-alert.png' : '/favicon.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
