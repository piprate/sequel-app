import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function search(
  instanceName,
  accessToken,
  query,
  resolve = true,
  limit = 5,
  excludeUnreviewed = false,
  signal = null,
  type = ''
) {
  const url =
    `${basename(instanceName)}/search?` +
    paramsString({
      q: query,
      resolve,
      limit,
      include_types: type,
      exclude_unreviewed: !!excludeUnreviewed
    })
  return get(url, auth(accessToken), {
    timeout: DEFAULT_TIMEOUT,
    signal
  })
}
