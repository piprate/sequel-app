import { database } from '../_database/database'
import { currentInstance, observedDigitalArt } from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get } from 'svelte/store'
import { getDigitalArt } from '../_api/studio'

async function _updateDigitalArt (id, instanceName, accessToken, asSpark) {
  const localPromise = database.getDigitalArt(instanceName, id)
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
    }
    console.error(e)
  }
}

export async function clearDigitalArt () {
  observedDigitalArt.set(null)
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
