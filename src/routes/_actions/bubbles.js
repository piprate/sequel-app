import { getBubble, getBubbleRelationship, newBubble, updateBubble } from '../_api/bubbles'
import { database } from '../_database/database'
import {
  clearComposeData,
  currentInstance,
  getComposeData,
  observedBubble,
  observedBubbleRelationship
} from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get, writable } from 'svelte/store'
import { prepareMediaItem } from './media'
import { unwrap, wrap } from '../_utils/mapper'
import { displayError } from './errors'

async function _updateBubble(bubbleId, instanceName, accessToken) {
  const localPromise = database.getBubble(instanceName, wrap(bubbleId))
  const remotePromise = getBubble(instanceName, accessToken, bubbleId).then((bubble) => {
    /* no await */
    database.setBubble(instanceName, bubble)
    return bubble
  })

  try {
    observedBubble.set(await localPromise)
  } catch (e) {
    console.error(e)
  }
  try {
    observedBubble.set(await remotePromise)
  } catch (e) {
    if (e.status === 404) {
      observedBubble.set(null)
      console.error(e)
    } else {
      throw e
    }
  }
}

async function _updateBubbleRelationship(bubbleId, instanceName, accessToken, asSpark) {
  if (!asSpark) {
    // relationship can only be retrieved for a specific spark
    observedBubbleRelationship.set(null)
    return
  }

  const localPromise = database.getBubbleRelationship(instanceName, wrap(bubbleId))
  const remotePromise = getBubbleRelationship(instanceName, accessToken, bubbleId, asSpark).then((relationship) => {
    /* no await */
    database.setBubbleRelationship(instanceName, relationship)
    return relationship
  })
  try {
    const rel = await localPromise
    if (rel && rel.referrer === asSpark) {
      observedBubbleRelationship.set(rel)
    }
  } catch (e) {
    if (e.status === 404) {
      observedBubbleRelationship.set(null)
      console.error(e)
    } else {
      displayError(e)
    }
  }
  try {
    observedBubbleRelationship.set(await remotePromise)
  } catch (e) {
    console.error(e)
  }
}

export async function updateLocalBubbleRelationship(instanceName, bubbleId, relationship) {
  await database.setBubbleRelationship(instanceName, relationship)
  try {
    observedBubbleRelationship.set(relationship)
  } catch (e) {
    console.error(e)
  }
}

export async function clearBubbleProfileAndRelationship() {
  observedBubble.set(null)
  observedBubbleRelationship.set(null)
}

export async function updateBubbleProfileAndRelationship(bubbleId) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  await Promise.all([
    _updateBubble(bubbleId, _currentInstance, token),
    _updateBubbleRelationship(bubbleId, _currentInstance, token, get(currentSparkId))
  ])
}

export async function updateBubbleRelationship(bubbleId) {
  await _updateBubbleRelationship(bubbleId, currentInstance.get(), get(accessToken), get(currentSparkId))
}

export const bubbleOperationInProgress = writable(false)
export const bubbleOperationError = writable(null)

export async function saveBubble(realm, bubbleId, template) {
  bubbleOperationInProgress.set(true)
  bubbleOperationError.set(null)

  let spark

  try {
    const submission = Object.assign(
      {
        summaryFormat: 'txt'
      },
      template
    )

    submission.name = submission.name.trim()

    const avatar = getComposeData(realm, 'avatar')
    const hadAvatar = getComposeData(realm, 'avatarPresent')
    if (avatar) {
      prepareMediaItem(avatar)
      submission.avatar = avatar.data
    } else if (hadAvatar) {
      submission.avatar = {}
    }

    const header = getComposeData(realm, 'header')
    const hadHeader = getComposeData(realm, 'headerPresent')
    if (header) {
      prepareMediaItem(header)
      submission.header = header.data
    } else if (hadHeader) {
      submission.header = {}
    }

    const asSpark = get(currentSparkId)

    if (!bubbleId) {
      spark = await newBubble(currentInstance.get(), get(accessToken), submission, asSpark)
    } else {
      spark = await updateBubble(currentInstance.get(), get(accessToken), unwrap(bubbleId), submission, asSpark)
    }

    clearComposeData(realm)
  } catch (err) {
    console.error(err)
    bubbleOperationError.set(err)
  } finally {
    bubbleOperationInProgress.set(false)
  }

  return spark
}

export async function loadBubble(bubbleId) {
  return getBubble(currentInstance.get(), get(accessToken), bubbleId)
}
