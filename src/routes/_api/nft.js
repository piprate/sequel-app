import { base } from './utils'
import { unwrap } from '../_utils/mapper'

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