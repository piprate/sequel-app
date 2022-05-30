// For convenience, periodically re-compute the current time. This ensures freshness of
// displays like "x minutes ago" without having to jump through a lot of hoops.
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
import { scheduleInterval } from '../../_utils/scheduleInterval'
import { transientStore } from '../base'

export const now = transientStore(Date.now())

const POLL_INTERVAL = 10000

export function nowObservers () {
  function updateNow () {
    now.set(Date.now())
  }

  function updateNowLazily () {
    scheduleIdleTask(updateNow)
  }

  updateNow()

  scheduleInterval(updateNowLazily, POLL_INTERVAL, /* runOnActive */ true)
}
