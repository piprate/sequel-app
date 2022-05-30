import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function pinPost (instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/pin`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unpinPost (instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/unpin`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
