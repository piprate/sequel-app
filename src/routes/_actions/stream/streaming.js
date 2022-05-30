import { TimelineStream } from '../../_api/stream/TimelineStream'
import { processMessage } from './processMessage'
import { fillStreamingGap } from './fillStreamingGap'
import { getFirstTimelineItemId } from "../../_store/timeline";

export function createStream (api, instanceName, accessToken, timelineName, firstStatusId, firstNotificationId) {
  console.log(`streaming ${instanceName} ${timelineName}: createStream`, 'firstStatusId', firstStatusId,
    'firstNotificationId', firstNotificationId)

  const fillGap = (timelineName, timelineItemId) => {
    if (timelineItemId) {
      console.log(`streaming ${instanceName} ${timelineName}: fillGap since`, timelineItemId)
      /* no await */ fillStreamingGap(instanceName, accessToken, timelineName, timelineItemId)
    }
  }

  const onMessage = message => {
    processMessage(instanceName, timelineName, message)
  }

  const onOpen = () => {
    console.log(`streaming ${instanceName} ${timelineName}: opened`)
    fillGap(timelineName, firstStatusId)
    if (timelineName === 'home') {
      // special case - home timeline stream also handles notifications
      fillGap('notifications', firstNotificationId)
    }
  }

  const onClose = () => {
    console.log(`streaming ${instanceName} ${timelineName}: closed`)
  }

  const onReconnect = () => {
    console.log(`streaming ${instanceName} ${timelineName}: reconnected`)
    // When reconnecting, we recompute the firstStatusId and firstNotificationId because these may have
    // changed since we first started streaming.
    const newFirstStatusId = getFirstTimelineItemId(instanceName, timelineName)
    fillGap(timelineName, newFirstStatusId)
    if (timelineName === 'home') {
      // special case - home timeline stream also handles notifications
      const newFirstNotificationId = getFirstTimelineItemId(instanceName, 'notifications')
      fillGap('notifications', newFirstNotificationId)
    }
  }

  return new TimelineStream(api, accessToken, timelineName)
    .on('message', onMessage)
    .on('open', onOpen)
    .on('close', onClose)
    .on('reconnect', onReconnect)
}
