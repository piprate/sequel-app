import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function favoritePost(instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/favourite`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unfavoritePost(instanceName, accessToken, postId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${postId}/unfavourite`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
