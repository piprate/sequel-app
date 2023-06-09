import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'
import { basename } from './utils'

export function getInstanceInfo(instanceName) {
  const url = `${basename(instanceName)}/instance`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
