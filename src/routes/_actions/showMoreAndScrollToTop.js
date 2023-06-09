import { showMoreItemsForCurrentTimeline } from './timeline'
import { scrollToTop } from '../_utils/scrollToTop'
import { createPostOrNotificationUuid } from '../_utils/createPostOrNotificationUuid'
import { currentInstance } from '../_store/local'
import { currentTimelineType, currentTimelineValue, timelineItemSummaries } from '../_store/timeline'
import { tryToFocusElement } from '../_utils/tryToFocusElement'
import { get } from 'svelte/store'

export function showMoreAndScrollToTop() {
  // Similar to Twitter, pressing "." will click the "show more" button and select
  // the first toot.
  showMoreItemsForCurrentTimeline()
  const _timelineItemSummaries = get(timelineItemSummaries)
  const _currentTimelineType = get(currentTimelineType)
  const _currentTimelineValue = get(currentTimelineValue)

  const firstItemSummary = _timelineItemSummaries && _timelineItemSummaries[0]
  if (!firstItemSummary) {
    return
  }
  const notificationId = _currentTimelineType === 'notifications' && firstItemSummary.id
  const postId = _currentTimelineType !== 'notifications' && firstItemSummary.id
  scrollToTop(/* smooth */ false)
  const id = createPostOrNotificationUuid(
    currentInstance.get(),
    _currentTimelineType,
    _currentTimelineValue,
    notificationId,
    postId
  )
  tryToFocusElement(id)
}
