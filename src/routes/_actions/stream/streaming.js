import { TimelineStream } from '../../_api/stream/TimelineStream'
import { processMessage } from './processMessage'
import { fillStreamingGap } from './fillStreamingGap'
import { getFirstTimelineItemId } from '../../_store/timeline'
import { get } from 'svelte/store'
import { loggedInInstances } from '../../_store/local'

export function createStream (instanceName, timelineName, firstPostId, asSpark) {
  console.log(`streaming ${instanceName} ${timelineName}: createStream`, 'firstPostId', firstPostId,
    'asSpark', asSpark)

  const _loggedInInstances = get(loggedInInstances)
  const _accessToken = _loggedInInstances && _loggedInInstances[instanceName] && _loggedInInstances[instanceName].access_token

  let firstNotificationId
  if (asSpark) {
    firstNotificationId = getFirstTimelineItemId(instanceName, 'notifications', asSpark)
  }

  const url = `wss://${instanceName}/streaming`

  const fillGap = (timelineName, timelineItemId, asSpark) => {
    if (timelineItemId) {
      console.log(`streaming ${instanceName} ${timelineName}: fillGap since`, timelineItemId, 'asSpark', asSpark)
      /* no await */
      fillStreamingGap(instanceName, _accessToken, timelineName, timelineItemId, asSpark)
    }
  }

  const onMessage = message => {
    processMessage(instanceName, _accessToken, message)
  }

  const onOpen = () => {
    console.log(`streaming ${instanceName} ${timelineName}: opened`)
    if (timelineName) {
      fillGap(timelineName, firstPostId, asSpark)
    }
    if (asSpark) {
      fillGap('notifications', firstNotificationId, asSpark)
    }
  }

  const onSwitchTimeline = (timeline, asSpark, firstPostId) => {
    console.log(`streaming ${instanceName} ${timelineName} ${asSpark} ${firstPostId}: switched`)
    if (timeline) {
      fillGap(timeline, firstPostId, asSpark)
    }
  }

  const onSwitchSpark = (asSpark) => {
    console.log(`streaming ${instanceName} ${asSpark}: switched`)
    if (asSpark) {
      const newFirstNotificationId = getFirstTimelineItemId(instanceName, 'notifications', asSpark)
      fillGap('notifications', newFirstNotificationId, asSpark)
    }
  }

  const onClose = () => {
    console.log(`streaming ${instanceName} ${timelineName}: closed`)
  }

  const onReconnect = (timelineName, asSpark) => {
    console.log(`streaming ${instanceName} ${timelineName}: reconnected`)
    if (timelineName) {
      // When reconnecting, we recompute the firstPostId because these may have
      // changed since we first started streaming.
      const newFirstPostId = getFirstTimelineItemId(instanceName, timelineName, asSpark)
      fillGap(timelineName, newFirstPostId, asSpark)
    }
    if (asSpark) {
      const newFirstNotificationId = getFirstTimelineItemId(instanceName, 'notifications', asSpark)
      fillGap('notifications', newFirstNotificationId, asSpark)
    }
  }

  return new TimelineStream(url, _accessToken, timelineName, asSpark)
    .on('message', onMessage)
    .on('open', onOpen)
    .on('close', onClose)
    .on('reconnect', onReconnect)
    .on('switchTimeline', onSwitchTimeline)
    .on('switchSpark', onSwitchSpark)
}
