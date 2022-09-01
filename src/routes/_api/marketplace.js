import { auth, base, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, paramsString, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { populateMediaURLsInMarketplaceListings, populateMediaURLsInSingleListing } from './media'

export function getListing (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace/${id}`
  return populateMediaURLsInSingleListing(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }),
    instanceName)
}

export async function confirmSale (instanceName, accessToken, id, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace/${id}/confirm-sale`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function initialiseMintOnDemand (instanceName, accessToken, id, buyerAddr, buyerKeyIndex, numEditions, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace/${id}/init-mod`
  return post(url, {
    buyerAddr,
    buyerKeyIndex,
    numEditions
  }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function getMintOnDemandSignature (instanceName, accessToken, id, buyerAddr, numEditions, signable, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace/${id}/sign-mod`
  return post(url, {
    buyerAddr,
    numEditions,
    tx: signable.message
  }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function confirmMintOnDemand (instanceName, accessToken, id, tokens, asSpark) {
  const url = `${base(instanceName, accessToken)}/marketplace/${id}/confirm-mod`
  return post(url, {
    tokens
  }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function getMarketplaceListings (instanceName, accessToken, asSpark, limit = 50) {
  const params = { limit, st: 'active' }
  let url = `${base(instanceName, accessToken)}/marketplace`
  url += '?' + paramsString(params)
  return await populateMediaURLsInMarketplaceListings(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }), instanceName
  )
}

export async function getReleaseListings (instanceName, accessToken, asSpark, release, limit = 50) {
  const params = { limit, r: release }
  let url = `${base(instanceName, accessToken)}/marketplace`
  url += '?' + paramsString(params)
  return await populateMediaURLsInMarketplaceListings(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }), instanceName
  )
}

export async function getMarketplaceHistory (instanceName, accessToken, asSpark, limit = 50) {
  let url = `${base(instanceName, accessToken)}/marketplace-history`
  return await populateMediaURLsInMarketplaceListings(
    get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }), instanceName
  )
}