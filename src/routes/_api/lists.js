import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getLists (instanceName, accessToken) {
  const url = `${basename(instanceName)}/lists`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function createList (instanceName, accessToken, title) {
  const url = `${basename(instanceName)}/lists`
  return post(url, { title }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
