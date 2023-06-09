import { auth, basename } from './utils'
import { del, get, post, put } from '../_utils/ajax'

export async function postSubscription(instanceName, accessToken, subscription, alerts) {
  const url = `${basename(instanceName)}/notification/subscription`

  return post(url, { subscription: subscription.toJSON(), data: { alerts } }, auth(accessToken))
}

export async function putSubscription(instanceName, accessToken, subscription, alerts) {
  const url = `${basename(instanceName)}/notification/subscription`

  return put(url, { data: { alerts }, subscription: subscription.toJSON() }, auth(accessToken))
}

export async function getSubscription(instanceName, accessToken) {
  const url = `${basename(instanceName)}/notification/subscription`

  return get(url, auth(accessToken))
}

export async function deleteSubscription(instanceName, accessToken) {
  const url = `${basename(instanceName)}/notification/subscription`

  return del(url, auth(accessToken))
}
