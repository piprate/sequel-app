import { base, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax'
import { populateDigitalArtMediaURLs } from './media'
import { unwrap } from '../_utils/mapper'

export async function getDigitalArts (instanceName, accessToken, asSpark, limit = 50) {
  let url = `${base(instanceName, accessToken)}/digital-art`
  url += '?' + paramsString({ limit, st: 'active' })
  return await populateMediaURLsInDigitalArts(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }), instanceName, accessToken
  )
}

export async function getDigitalArt (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/digital-art/${unwrap(id)}`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }).then((listing) => {
    populateDigitalArtMediaURLs(listing, instanceName, accessToken)
    return listing
  })
}

export function populateMediaURLsInDigitalArts (apiCall, instanceName, accessToken) {
  return apiCall.then((entityList) => {
    for (const entity of entityList) {
      populateDigitalArtMediaURLs(entity, instanceName, accessToken)
    }
    return entityList
  })
}
