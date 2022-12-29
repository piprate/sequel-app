import { auth, base, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { populateMediaURLsInMarketplaceListings } from './media'

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
