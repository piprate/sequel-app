import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getSubRequests (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/follow_requests`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function approveSubscriptionRequest (instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${sparkId}/authorize`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function rejectSubscriptionRequest (instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${sparkId}/reject`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
