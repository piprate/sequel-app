import { base, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'
import { populateDigitalArtTokenMediaURLs } from './media'

export function populateExternalNFTPreviewURLs (entity, instanceName, accessToken, source, accountId, tokenId) {
  const baseUrl = `${base(instanceName, accessToken)}/external/nft?src=${source}&a=${accountId}&t=${tokenId}&profile=preview`

  entity.url = baseUrl
  entity.previewUrl = baseUrl
  entity.staticUrl = baseUrl

  return entity
}

export function populateDigitalArtPreviewURLs (entity, instanceName, daId) {
  const baseUrl = `${base(instanceName, null)}/digital-art/${unwrap(daId)}/content`

  entity.url = baseUrl
  entity.previewUrl = baseUrl + '/preview'
  entity.staticUrl = baseUrl

  return entity
}

export async function getDigitalArtToken (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/nft/digital-art/${id}`
  return await get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }).then((token) => {
    populateDigitalArtTokenMediaURLs(token, instanceName)
    return token
  })
}
