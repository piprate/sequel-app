import { auth, basename } from './utils'
import { post, WRITE_TIMEOUT } from '../_utils/ajax'

export async function blockSpark (instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${sparkId}/block`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unblockSpark (instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${sparkId}/unblock`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
