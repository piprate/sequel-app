import { DEFAULT_TIMEOUT, del, get, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getFilters (instanceName, accessToken) {
  const url = `${basename(instanceName)}/filters`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function createFilter (instanceName, accessToken, filter) {
  const url = `${basename(instanceName)}/filters`
  return post(url, filter, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export function updateFilter (instanceName, accessToken, filter) {
  const url = `${basename(instanceName)}/filters/${filter.id}`
  return put(url, filter, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export function deleteFilter (instanceName, accessToken, id) {
  const url = `${basename(instanceName)}/filters/${id}`
  return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
