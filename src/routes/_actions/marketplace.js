import { database } from '../_database/database'
import { clearComposeData, currentInstance, observedListing, observedRelease } from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { get } from 'svelte/store'
import { cancel, editRelease, getMarketplaceRelease, newRelease } from '../_api/releases'
import { unwrap } from '../_utils/mapper'
import { getListing, withdrawMarketplaceListing } from '../_api/marketplace'
import { goto } from '$app/navigation'

async function _updateListing(id, instanceName, accessToken, asSpark) {
  const localPromise = database.getListing(instanceName, parseInt(id))
  const remotePromise = getListing(instanceName, accessToken, id, asSpark).then((listing) => {
    /* no await */
    database.setListing(instanceName, listing)
    return listing
  })

  try {
    observedListing.set(await localPromise)
  } catch (e) {
    console.error(e)
  }
  try {
    observedListing.set(await remotePromise)
  } catch (e) {
    if (e.status === 404) {
      observedListing.set(null)
      console.error(e)
    } else {
      throw e
    }
  }
}

export async function clearListing() {
  observedListing.set(null)
}

export async function updateListing(id) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  const asSpark = get(currentSparkId)
  await _updateListing(id, _currentInstance, token, asSpark)
}

export async function loadListing(id) {
  return getListing(currentInstance.get(), get(accessToken), id, get(currentSparkId))
}

export async function updateRelease(id, newRelease = undefined) {
  if (newRelease) {
    observedRelease.set(newRelease)
    return newRelease
  } else {
    const release = await getMarketplaceRelease(
      currentInstance.get(),
      get(accessToken),
      unwrap(id),
      get(currentSparkId)
    )
    if (release) observedRelease.set(release)
    return release
  }
}

export async function saveRelease(realm, releaseId, payload) {
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
  } else {
    release = await editRelease(currentInstance.get(), get(accessToken), releaseId, submission, asSpark)
  }

  clearComposeData(realm)

  return release
}

export async function cancelRelease(releaseId) {
  await cancel(currentInstance.get(), get(accessToken), releaseId, get(currentSparkId))
  const release = await updateRelease(releaseId)

  return release
}

export async function withdrawListing(listingId) {
  const listing = await withdrawMarketplaceListing(
    currentInstance.get(),
    get(accessToken),
    listingId,
    get(currentSparkId)
  )
  await updateListing(listing.id)
  goto('/marketplace')
}
