import { auth, base, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'

export async function getMarketplaceReleases (instanceName, accessToken, asSpark, limit = 50) {
  let url = `${base(instanceName, accessToken)}/marketplace-releases`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}

export async function getMarketplaceRelease (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace-release/${id}`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}