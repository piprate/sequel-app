import { base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { populateMarketplaceListingMediaURLs, populateMediaURLsInMarketplaceListings } from './media'
import { unwrap } from '../_utils/mapper'

export async function getMarketplaceReleases(instanceName, accessToken, asSpark, limit = 50) {
  const url = `${base(instanceName, accessToken)}/marketplace-releases`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}

export async function getMarketplaceRelease(instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${id}`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}

export async function getReleaseListings(instanceName, accessToken, id, asSpark, limit = 50) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${id}/listings`
  return await populateMediaURLsInMarketplaceListings(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }),
    instanceName
  )
}

export async function announceRelease(instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${unwrap(id)}/announce`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function activateRelease(instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${unwrap(id)}/activate`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function editRelease(instanceName, accessToken, id, data, asSpark) {
  const url = `${basename(instanceName)}/marketplace-release/${unwrap(id)}`
  const result = await put(url, data, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })

  populateMarketplaceListingMediaURLs(result, instanceName)
  return result
}

export async function newRelease(instanceName, accessToken, data, asSpark) {
  const url = `${basename(instanceName)}/marketplace-release`
  const result = await post(url, data, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })

  populateMarketplaceListingMediaURLs(result, instanceName)
  return result
}

export async function cancel(instanceName, accessToken, id, asSpark) {
  const url = `${basename(instanceName)}/marketplace-release/${unwrap(id)}/cancel`
  const result = await post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })

  populateMarketplaceListingMediaURLs(result, instanceName)
  return result
}
