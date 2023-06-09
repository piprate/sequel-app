import { updateInstanceInfo, updateUserForInstance } from '../../_actions/instances'
import { setupListsForInstance } from '../../_actions/lists'
import { createStream } from '../../_actions/stream/streaming'
import { updatePushSubscriptionForInstance } from '../../_actions/pushSubscription'
import { setupCustomEmojiForInstance } from '../../_actions/emoji'
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
import { mark, stop } from '../../_utils/marks'
import { currentSparkId } from '../instance'
import { get } from 'svelte/store'
import { updateSubRequestCountIfLockedUser } from '../../_actions/subscriptionRequests'
import { setupFiltersForInstance } from '../../_actions/filters'
import { currentInstance, currentInstanceStream, loggedInInstances } from '../local'
import { inNode } from '../../_utils/browserOrNode'

async function refreshInstanceDataAndStream(instanceName, accessToken) {
  mark(`refreshInstanceDataAndStream-${instanceName}`)
  await doRefreshInstanceDataAndStream(instanceName, accessToken)
  stop(`refreshInstanceDataAndStream-${instanceName}`)
}

function currentInstanceChanged(instanceName) {
  return currentInstance.get() !== instanceName
}

async function doRefreshInstanceDataAndStream(instanceName, accessToken) {
  if (currentInstanceChanged(instanceName)) {
    return
  }

  await refreshInstanceData(instanceName, accessToken)

  if (currentInstanceChanged(instanceName)) {
    return
  }

  stream(instanceName)
}

async function refreshInstanceData(instanceName, accessToken) {
  const criticalPromises = [updateInstanceInfo(instanceName)]

  // these are all low-priority
  scheduleIdleTask(() => setupCustomEmojiForInstance(instanceName))
  scheduleIdleTask(() => setupListsForInstance(instanceName))
  scheduleIdleTask(() => setupFiltersForInstance(instanceName))
  scheduleIdleTask(() => updatePushSubscriptionForInstance(instanceName))

  criticalPromises.push(
    updateUserForInstance(instanceName).then(() => {
      // Once we have the user profile (so we know if the user is locked), lazily update the subscription requests
      scheduleIdleTask(() => updateSubRequestCountIfLockedUser(instanceName))
    })
  )

  // these are the only critical ones
  await Promise.all(criticalPromises)
}

function stream(instanceName) {
  const asSpark = get(currentSparkId)

  let _currentInstanceStream = get(currentInstanceStream)

  if (!_currentInstanceStream) {
    _currentInstanceStream = createStream(instanceName, '', '', asSpark)

    currentInstanceStream.set(_currentInstanceStream)

    if (!import.meta.env.PROD) {
      window.currentTimelineStream = _currentInstanceStream
    }
  } else {
  }
}

export function instanceObservers() {
  currentInstance.subscribe((_currentInstance) => {
    if (inNode()) {
      return
    }

    const _currentInstanceStream = get(currentInstanceStream)

    if (_currentInstanceStream) {
      _currentInstanceStream.close()
      currentInstanceStream.set(null)
      if (!import.meta.env.PROD) {
        window.currentInstanceStream = null
      }
    }
    if (!_currentInstance) {
      return
    }

    const _accessToken = loggedInInstances.get()[_currentInstance].access_token || ''

    if (_accessToken !== '') {
      scheduleIdleTask(() => refreshInstanceDataAndStream(_currentInstance, _accessToken))
    }
  })
}
