import { scheduleIdleTask } from './scheduleIdleTask'
import { pageVisibilityHidden } from '../_store/local'
import { isMobile } from './userAgent/isMobile'

// Rough guess at whether this is a "mobile" device or not, for the purposes
// of "device class" estimations

// Run a task that doesn't need to be processed immediately, but should
// probably be delayed if we're on a mobile device. Also run it sooner
// if we're in a hidden tab, since browsers throttle or don't run setTimeout/rAF/etc.
export function runMediumPriorityTask (fn) {
  if (pageVisibilityHidden.get()) {
    fn()
  } else if (isMobile()) {
    scheduleIdleTask(fn)
  } else {
    requestAnimationFrame(fn)
  }
}
