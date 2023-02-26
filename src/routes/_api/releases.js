import { auth, base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { populateMarketplaceListingMediaURLs, populateMediaURLsInMarketplaceListings } from './media'

export async function getMarketplaceReleases (instanceName, accessToken, asSpark, limit = 50) {
  const url = `${base(instanceName, accessToken)}/marketplace-releases`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}

export async function getMarketplaceRelease (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${id}`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}

export async function getReleaseListings (instanceName, accessToken, id, asSpark, limit = 50) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${id}/listings`
  return await populateMediaURLsInMarketplaceListings(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }), instanceName
  )
}

export async function newRelease (instanceName, accessToken, data, asSpark) {
  const url = `${basename(instanceName)}/marketplace-release`
  const result = await post(url, data, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })

  populateMarketplaceListingMediaURLs(result, instanceName)
  return result
}

