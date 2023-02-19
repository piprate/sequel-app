import { database } from '../_database/database'
import { clearComposeData, currentInstance, observedDigitalArt } from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get, writable } from 'svelte/store'
import { wrap } from '../_utils/mapper'
import { getDigitalArt, newDigitalArt } from '../_api/studio'

async function _updateDigitalArt (id, instanceName, accessToken, asSpark) {
  const localPromise = database.getDigitalArt(instanceName, wrap(id))
  const remotePromise = getDigitalArt(instanceName, accessToken, id, asSpark).then(digitalArt => {
    /* no await */
    database.setDigitalArt(instanceName, digitalArt)
    return digitalArt
  })

  try {
    observedDigitalArt.set((await localPromise))
  } catch (e) {
    console.error(e)
  }
  try {
    observedDigitalArt.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedDigitalArt.set(null)
      console.error(e)
    } else {
      throw e
    }
  }
}

export async function clearDigitalArt () {
  observedDigitalArt.set(null)
}

export const digitalArtOperationInProgress = writable(false)
export const digitalArtOperationError = writable(null)

export async function saveDigitalArt (realm, digitalArtId, submission) {
  digitalArtOperationInProgress.set(true)
  digitalArtOperationError.set(null)

  let spark

  try {
    submission.name = submission.name.trim()

    if (!submission.name) {
      throw new Error('Name is required')
    }

    if (submission.name.length >= 120) {
      throw new Error('Name needs to be less than 120 characters long')
    }

    if (submission.maxEdition < 0 || submission.maxEdition > 100) {
      throw new Error('Max Editions should be in the range of 0 to 100')
    }

    if (!submission.content) {
      throw new Error('Image is required')
    }

    const asSpark = get(currentSparkId)

    if (!digitalArtId) {
      spark = await newDigitalArt(currentInstance.get(), get(accessToken), submission, asSpark)
    }

    clearComposeData(realm)
  } catch (err) {
    digitalArtOperationError.set(err)
  } finally {
    digitalArtOperationInProgress.set(false)
  }

  return spark
}

export async function updateDigitalArt (id) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  const asSpark = get(currentSparkId)
  await _updateDigitalArt(id, _currentInstance, token, asSpark)
}

export async function loadDigitalArt (id) {
  return getDigitalArt(currentInstance.get(), get(accessToken), id, get(currentSparkId))
}
