import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { basename, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'

export async function bookmarkSpark(instanceName, accessToken, sparkId, asSpark) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/bookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unbookmarkSpark(instanceName, accessToken, sparkId, asSpark) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/unbookmark`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
