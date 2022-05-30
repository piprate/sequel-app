import { DEFAULT_TIMEOUT, get, paramsString, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'

export async function getSubscriptionProposal (instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/subscription-plans`
  return get(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function requestSubscription (instanceName, accessToken, sparkId, planId, asSpark) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/request-subscription`
  return post(url, {
    plan: planId
  }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function confirmSubscription (instanceName, accessToken, sparkId, offer, paymentConfirmation, asSpark) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/confirm-subscription`
  return post(url, {
    offer,
    paymentConfirmation
  }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unsubscribeFromSpark (instanceName, accessToken, sparkId, asSpark) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/unsubscribe`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function getSubscribers (instanceName, accessToken, sparkId, limit = 80) {
  let url = `${basename(instanceName)}/spark/${unwrap(sparkId)}/subscribers`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
