import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'
import { base, sequelAuth } from './utils'

export const getEvergreenTemplates = async (instanceName, accessToken, asSpark) => {
  const url = `${base(instanceName, accessToken)}/evergreen-templates`
  return get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}
