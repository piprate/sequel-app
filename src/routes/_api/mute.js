import { auth, basename } from './utils'
import { post, WRITE_TIMEOUT } from '../_utils/ajax'

export async function muteSpark(instanceName, accessToken, sparkId, notifications) {
  const url = `${basename(instanceName)}/api/v1/accounts/${sparkId}/mute`
  return post(url, { notifications }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unmuteSpark(instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${sparkId}/unmute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
