import { addPostsOrNotifications } from '../addPostOrNotification'
import { getTimeline } from '../../_api/timelines'

const TIMELINE_GAP_BATCH_SIZE = 20 // Mastodon timeline API maximum limit
const MAX_NUM_REQUESTS = 15 // to avoid getting caught in an infinite loop somehow

// fill in the "streaming gap" – i.e. fetch the most recent items so that there isn't
// a big gap in the timeline if you haven't looked at it in awhile
export async function fillStreamingGap (instanceName, accessToken, timelineName, firstTimelineItemId, asSpark) {
  let maxId = null
  let numRequests = 0
  let newTimelineItems

  if (timelineName.startsWith('post/')) {
    // don't fill gap in post timelines
    return
  }
  do {
    numRequests++
    newTimelineItems = (await getTimeline(instanceName, accessToken, asSpark,
      timelineName, maxId, firstTimelineItemId, TIMELINE_GAP_BATCH_SIZE)).items
    if (newTimelineItems.length) {
      addPostsOrNotifications(instanceName, timelineName, newTimelineItems, asSpark)
      maxId = newTimelineItems[newTimelineItems.length - 1].timelineID
    }
  } while (numRequests < MAX_NUM_REQUESTS && newTimelineItems.length === TIMELINE_GAP_BATCH_SIZE)
}
