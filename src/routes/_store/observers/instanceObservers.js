import { updateInstanceInfo, updateVerifyCredentialsForInstance } from '../../_actions/instances'
import { setupListsForInstance } from '../../_actions/lists'
import { createStream } from '../../_actions/stream/streaming'
import { updatePushSubscriptionForInstance } from '../../_actions/pushSubscription'
import { setupCustomEmojiForInstance } from '../../_actions/emoji'
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
import { mark, stop } from '../../_utils/marks'
import { accessToken, currentInstanceInfo } from '../instance'
import { get } from 'svelte/store';
import { getFirstTimelineItemId } from '../timeline'
import { updateFollowRequestCountIfLockedAccount } from '../../_actions/followRequests'
import { setupFiltersForInstance } from '../../_actions/filters'
import { currentInstance } from "../local";

// stream to watch for home timeline updates and notifications
let currentInstanceStream

async function refreshInstanceDataAndStream(instanceName) {
  mark(`refreshInstanceDataAndStream-${instanceName}`)
  await doRefreshInstanceDataAndStream(instanceName)
  stop(`refreshInstanceDataAndStream-${instanceName}`)
}

function currentInstanceChanged(instanceName) {
  return currentInstance.get() !== instanceName
}

async function doRefreshInstanceDataAndStream(instanceName) {
  if (currentInstanceChanged(instanceName)) {
    return
  }

  await refreshInstanceData(instanceName)

  // FIXME: re-enable streaming when ready

  // if (currentInstanceChanged(instanceName)) {
  //   return
  // }
  //
  // const _currentInstanceInfo = get(currentInstanceInfo);
  // if (!_currentInstanceInfo) {
  //   return
  // }
  //
  // stream(instanceName, _currentInstanceInfo)
}

async function refreshInstanceData(instanceName) {
  // these are all low-priority
  scheduleIdleTask(() => setupCustomEmojiForInstance(instanceName))
  scheduleIdleTask(() => setupListsForInstance(instanceName))
  scheduleIdleTask(() => setupFiltersForInstance(instanceName))
  scheduleIdleTask(() => updatePushSubscriptionForInstance(instanceName))

  // these are the only critical ones
  await Promise.all([
    updateInstanceInfo(instanceName),
    updateVerifyCredentialsForInstance(instanceName).then(() => {
      // Once we have the verifyCredentials (so we know if the account is locked), lazily update the follow requests
      scheduleIdleTask(() => updateFollowRequestCountIfLockedAccount(instanceName))
    })
  ])
}

function stream(instanceName, currentInstanceInfo) {
  const _accessToken = get(accessToken);
  const streamingApi = currentInstanceInfo.urls.streaming_api;
  const firstStatusId = getFirstTimelineItemId(instanceName, 'home');
  const firstNotificationId = getFirstTimelineItemId(instanceName, 'notifications');

  currentInstanceStream = createStream(streamingApi, instanceName, _accessToken, 'home',
    firstStatusId, firstNotificationId);

  if (process.env.NODE_ENV !== 'production') {
    window.currentInstanceStream = currentInstanceStream;
  }
}

export function instanceObservers() {
  currentInstance.subscribe(_currentInstance => {
    if (!process.browser) {
      return
    }
    if (currentInstanceStream) {
      currentInstanceStream.close()
      currentInstanceStream = null
      if (process.env.NODE_ENV !== 'production') {
        window.currentInstanceStream = null
      }
    }
    if (!currentInstance) {
      return
    }

    scheduleIdleTask(() => refreshInstanceDataAndStream(_currentInstance))
  });
}
