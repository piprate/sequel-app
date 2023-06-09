import { patch, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function updateCredentials(instanceName, accessToken, userData) {
  const url = `${basename(instanceName)}/api/v1/accounts/update_credentials`
  return patch(url, userData, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
