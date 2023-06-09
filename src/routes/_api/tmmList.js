import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getTMMs(instanceName, accessToken, postId, limit = 80) {
  let url = `${basename(instanceName)}/post/${postId}/tmm`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
