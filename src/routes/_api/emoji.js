import { auth, basename } from './utils'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'

export function getCustomEmoji (instanceName, accessToken) {
  const url = `${basename(instanceName)}/custom-emoji`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
