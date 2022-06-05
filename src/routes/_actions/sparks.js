import { getSpark, newSpark, updateSpark } from '../_api/sparks'
import { getRelationship } from '../_api/relationships'
import { database } from '../_database/database'
import {
  clearComposeData,
  currentInstance,
  getComposeData,
  instanceCurrentSparks,
  observedRelationship,
  observedSpark
} from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get, writable } from 'svelte/store'
import { prepareMediaItem } from './media'
import { unwrap } from '../_utils/mapper'

export function setCurrentSpark (instanceName, spark) {
  const _instanceCurrentSparks = instanceCurrentSparks.get()
  _instanceCurrentSparks[instanceName] = spark
  instanceCurrentSparks.set(_instanceCurrentSparks)
}

async function _updateSpark (sparkId, instanceName, accessToken) {
  const localPromise = database.getSpark(instanceName, sparkId)
  const remotePromise = getSpark(instanceName, accessToken, sparkId).then(spark => {
    /* no await */
    database.setSpark(instanceName, spark)
    return spark
  })

  try {
    observedSpark.set((await localPromise))
  } catch (e) {
    console.error(e)
  }
  try {
    observedSpark.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedSpark.set(null)
    }
    console.error(e)
  }
}

async function _updateRelationship (sparkId, instanceName, accessToken, asSpark) {
  if (!asSpark) {
    // relationship can only be retrieved for a specific spark
    observedRelationship.set(null)
    return
  }

  const localPromise = database.getRelationship(instanceName, sparkId)
  const remotePromise = getRelationship(instanceName, accessToken, sparkId, asSpark).then(relationship => {
    /* no await */
    database.setRelationship(instanceName, relationship)
    return relationship
  })
  try {
    const rel = await localPromise
    if (rel && rel.referrer === asSpark) {
      observedRelationship.set(rel)
    }
  } catch (e) {
    console.error(e)
  }
  try {
    observedRelationship.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedRelationship.set(null)
    }
    console.error(e)
  }
}

export async function updateLocalRelationship (instanceName, sparkId, relationship) {
  await database.setRelationship(instanceName, relationship)
  try {
    observedRelationship.set(relationship)
  } catch (e) {
    console.error(e)
  }
}

export async function clearProfileAndRelationship () {
  observedSpark.set(null)
  observedRelationship.set(null)
}

export async function updateProfileAndRelationship (sparkId) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  await Promise.all([
    _updateSpark(sparkId, _currentInstance, token),
    _updateRelationship(sparkId, _currentInstance, token, get(currentSparkId))
  ])
}

export async function updateRelationship (sparkId) {
  await _updateRelationship(sparkId, currentInstance.get(), get(accessToken), get(currentSparkId))
}

export const sparkOperationInProgress = writable(false)
export const sparkOperationError = writable(null)

const GENERIC_ERROR = 'Unexpected error when processing a Sequel operation. Are you in private browsing mode?'

export async function saveSpark (realm, sparkId, template) {
  sparkOperationInProgress.set(true)
  sparkOperationError.set(null)

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

    if (!sparkId) {
      spark = await newSpark(currentInstance.get(), get(accessToken), submission)
    } else {
      spark = await updateSpark(currentInstance.get(), get(accessToken), unwrap(sparkId), submission)
    }

    clearComposeData(realm)
  } catch (err) {
    console.error(err)
    const error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine ? GENERIC_ERROR : 'Are you offline?'))
    sparkOperationError.set(error)
  } finally {
    sparkOperationInProgress.set(false)
  }

  return spark
}

export async function loadSpark (sparkId) {
  return getSpark(currentInstance.get(), get(accessToken), sparkId)
}
