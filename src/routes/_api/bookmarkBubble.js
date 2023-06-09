import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { basename, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'

export async function bookmarkBubble(instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${unwrap(bubbleId)}/bookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unbookmarkBubble(instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${unwrap(bubbleId)}/unbookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
