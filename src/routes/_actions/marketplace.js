import { database } from '../_database/database'
import { clearComposeData, currentInstance, observedListing } from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get } from 'svelte/store'
import { getListing } from '../_api/marketplace'
import { newRelease } from '../_api/releases'

async function _updateListing (id, instanceName, accessToken, asSpark) {
  const localPromise = database.getListing(instanceName, parseInt(id))
  const remotePromise = getListing(instanceName, accessToken, id, asSpark).then(listing => {
    /* no await */
    database.setListing(instanceName, listing)
    return listing
  })

  try {
    observedListing.set((await localPromise))
  } catch (e) {
    console.error(e)
  }
  try {
    observedListing.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedListing.set(null)
      console.error(e)
    } else {
      throw e
    }
  }
}

export async function clearListing () {
  observedListing.set(null)
}

export async function updateListing (id) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  const asSpark = get(currentSparkId)
  await _updateListing(id, _currentInstance, token, asSpark)
}

export async function loadListing (id) {
  return getListing(currentInstance.get(), get(accessToken), id, get(currentSparkId))
}

export async function saveRelease (realm, releaseId, payload) {
  let release

  const submission = { ...payload }

  submission.name = submission.name.trim()
  submission.startTime = submission.startTime ? new Date(submission.startTime).toISOString() : undefined
  submission.endTime = submission.endTime ? new Date(submission.endTime).toISOString() : undefined

  if (!submission.name) {
    throw new Error('Name is required')
  }
  
  const asSpark = get(currentSparkId)
  submission.seller = asSpark

  if (!releaseId) {
    release = await newRelease(currentInstance.get(), get(accessToken), submission, asSpark)
  }

  clearComposeData(realm)

  return release
}