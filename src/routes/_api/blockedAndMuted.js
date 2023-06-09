import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getBlockedSparks(instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/blocks`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getMutedSparks(instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/mutes`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
