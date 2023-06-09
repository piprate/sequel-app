import { getScrollContainer } from './scrollContainer'
import { smoothScroll } from './smoothScroll'

export function scrollToTop(smooth, reduceMotion) {
  const scroller = getScrollContainer()
  const { scrollTop } = scroller
  if (scrollTop === 0) {
    return false
  }
  if (smooth) {
    smoothScroll(scroller, 0, /* horizontal */ false, /* preferFast */ true, reduceMotion)
  } else {
    scroller.scrollTop = 0
  }
  return true
}
