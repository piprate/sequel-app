import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { auth, base, sequelAuth } from './utils'

export async function getPinnedPosts(instanceName, accessToken, sparkId, asSpark) {
  let url = `${base(instanceName, accessToken)}/spark/${sparkId}/timeline`
  url +=
    '?' +
    paramsString({
      limit: 40,
      pinned: true
    })
  return get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}
