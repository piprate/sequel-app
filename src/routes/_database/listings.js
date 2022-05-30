import { LISTINGS_STORE } from './constants'
import { listingsCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getListing (instanceName, id) {
  return getGenericEntityWithId(LISTINGS_STORE, listingsCache, instanceName, id)
}

export async function setListing (instanceName, listing) {
  return setGenericEntityWithId(LISTINGS_STORE, listingsCache, instanceName, cloneForStorage(listing))
}
