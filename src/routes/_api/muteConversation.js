import { auth, basename } from './utils'
import { post, WRITE_TIMEOUT } from '../_utils/ajax'

export async function muteConversation (instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/mute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unmuteConversation (instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/unmute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
