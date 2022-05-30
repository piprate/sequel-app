import { basename, sequelAuth } from './utils'
import { del, WRITE_TIMEOUT } from '../_utils/ajax'
import { unwrap } from '../_utils/mapper'

export async function deletePost (instanceName, accessToken, bubbleId, postId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${unwrap(bubbleId)}/post/${unwrap(postId)}`
  return del(url, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
