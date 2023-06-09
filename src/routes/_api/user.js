import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getUser(instanceName, accessToken) {
  const url = `${basename(instanceName)}/user`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function updateUser(instanceName, accessToken, user) {
  const url = `${basename(instanceName)}/user`
  return post(url, user, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export function enrollUser(instanceName, accessToken, secondLevelRecoveryCode) {
  const url = `${basename(instanceName)}/enroll`
  return post(
    url,
    {
      slrc: secondLevelRecoveryCode
    },
    auth(accessToken),
    { timeout: WRITE_TIMEOUT }
  )
}
