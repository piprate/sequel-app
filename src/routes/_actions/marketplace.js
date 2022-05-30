import { database } from '../_database/database'
import { currentInstance, observedListing } from '../_store/local'
import { accessToken } from '../_store/instance'
import { get } from 'svelte/store'
import { getListing } from '../_api/marketplace'

async function _updateListing (id, instanceName, accessToken) {
  const localPromise = database.getListing(instanceName, id)
  const remotePromise = getListing(instanceName, accessToken, id).then(listing => {
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
    }
    console.error(e)
  }
}

export async function clearListing () {
  observedListing.set(null)
}

export async function updateListing (id) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  await _updateListing(id, _currentInstance, token)
}

export async function loadListing (id) {
  return getListing(currentInstance.get(), get(accessToken), id)
}
