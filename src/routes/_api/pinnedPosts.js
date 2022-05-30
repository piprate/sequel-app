import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { auth, base } from './utils'

export async function getPinnedPosts (instanceName, accessToken, sparkId) {
  let url = `${base(instanceName, accessToken)}/spark/${sparkId}/timeline`
  url += '?' + paramsString({
    limit: 40,
    pinned: true
  })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
