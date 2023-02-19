import { base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString, post, WRITE_TIMEOUT } from '../_utils/ajax'
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

export async function newDigitalArt (instanceName, accessToken, data, asSpark) {
  const url = `${basename(instanceName)}/digital-art`
  const result = await post(url, data, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })

  return populateDigitalArtMediaURLs(result, instanceName, accessToken)
}

export function populateMediaURLsInDigitalArts (apiCall, instanceName, accessToken) {
  return apiCall.then((entityList) => {
    for (const entity of entityList) {
      populateDigitalArtMediaURLs(entity, instanceName, accessToken)
    }
    return entityList
  })
}

export function finaliseOffer (instanceName, accessToken, id, data, asSpark) {
  const url = `${base(instanceName, accessToken)}/digital-art/${unwrap(id)}/offer`
  return post(url, data, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })
}
