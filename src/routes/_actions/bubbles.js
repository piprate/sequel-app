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
import { unwrap } from '../_utils/mapper'

async function _updateBubble (bubbleId, instanceName, accessToken) {
  const localPromise = database.getBubble(instanceName, bubbleId)
  const remotePromise = getBubble(instanceName, accessToken, bubbleId).then(world => {
    /* no await */
    database.setBubble(instanceName, world)
    return world
  })

  try {
    observedBubble.set((await localPromise))
  } catch (e) {
    console.error(e)
  }
  try {
    observedBubble.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedBubble.set(null)
    }
    console.error(e)
  }
}

async function _updateBubbleRelationship (bubbleId, instanceName, accessToken, asSpark) {
  if (!asSpark) {
    // relationship can only be retrieved for a specific spark
    observedBubbleRelationship.set(null)
    return
  }

  const localPromise = database.getBubbleRelationship(instanceName, bubbleId)
  const remotePromise = getBubbleRelationship(instanceName, accessToken, bubbleId, asSpark).then(relationship => {
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
    }
    console.error(e)
  }
  try {
    observedBubbleRelationship.set((await remotePromise))
  } catch (e) {
    console.error(e)
  }
}

export async function updateLocalBubbleRelationship (instanceName, bubbleId, relationship) {
  await database.setBubbleRelationship(instanceName, relationship)
  try {
    observedBubbleRelationship.set(relationship)
  } catch (e) {
    console.error(e)
  }
}

export async function clearBubbleProfileAndRelationship () {
  observedBubble.set(null)
  observedBubbleRelationship.set(null)
}

export async function updateBubbleProfileAndRelationship (bubbleId) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  await Promise.all([
    _updateBubble(bubbleId, _currentInstance, token),
    _updateBubbleRelationship(bubbleId, _currentInstance, token, get(currentSparkId))
  ])
}

export async function updateBubbleRelationship (bubbleId) {
  await _updateBubbleRelationship(bubbleId, currentInstance.get(), get(accessToken), get(currentSparkId))
}

export const bubbleOperationInProgress = writable(false)
export const bubbleOperationError = writable(null)

const GENERIC_ERROR = 'Unexpected error when processing a Sequel operation. Are you in private browsing mode?'

export async function saveBubble (realm, bubbleId, template) {
  bubbleOperationInProgress.set(true)
  bubbleOperationError.set(null)

  let spark

  try {
    const submission = Object.assign({
      summaryFormat: 'txt'
    }, template)

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
    const error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine ? GENERIC_ERROR : 'Are you offline?'))
    bubbleOperationError.set(error)
  } finally {
    bubbleOperationInProgress.set(false)
  }

  return spark
}

export async function loadBubble (bubbleId) {
  return getBubble(currentInstance.get(), get(accessToken), bubbleId)
}
