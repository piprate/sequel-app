import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { basename, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'

export async function bookmarkPost(instanceName, accessToken, postId, asSpark) {
  const url = `${basename(instanceName)}/post/${unwrap(postId)}/bookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unbookmarkPost(instanceName, accessToken, postId, asSpark) {
  const url = `${basename(instanceName)}/post/${unwrap(postId)}/unbookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
