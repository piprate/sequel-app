import { auth, basename } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'

export async function getRelationship (instanceName, accessToken, sparkId, asSpark) {
  const url = `${basename(instanceName)}/spark/${sparkId}/relationship?${paramsString({ as: asSpark })}`
  return await get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
