import { auth, base, basename } from './utils'
import { DEFAULT_TIMEOUT, MEDIA_WRITE_TIMEOUT, post, postBinary } from '../_utils/ajax'
import { unwrap, unwrapBlob } from '../_utils/mapper'

export async function uploadMedia (instanceName, accessToken, file, calculateBlurhash, mediaProfile) {
  const url = `${basename(instanceName)}/media-asset?profile=${mediaProfile}${calculateBlurhash ? '&hash=true' : ''}`
  return postBinary(url, file, auth(accessToken), { timeout: MEDIA_WRITE_TIMEOUT })
}

export async function uploadTokenMedia (instanceName, accessToken, form) {
  const url = `${basename(instanceName)}/media-asset/external/nft`
  return post(url, form, auth(accessToken), { timeout: MEDIA_WRITE_TIMEOUT })
}

export function populateEntityMediaURLs (entity, instanceName, entityType) {
  const baseUrl = `${base(instanceName, null)}/${entityType}/${unwrap(entity.id)}`

  if (entity.avatar) {
    const thumbs = entity.avatar.thumbnails
    const avatarUrl = baseUrl + '/avatar'
    entity.avatar.url = avatarUrl
    entity.avatar.previewUrl = thumbs && thumbs.preview ? avatarUrl + '/preview' : avatarUrl
    entity.avatar.staticUrl = thumbs && thumbs.static ? avatarUrl + '/static' : entity.avatar.previewUrl
  }

  if (entity.header) {
    const thumbs = entity.header.thumbnails
    const headerUrl = baseUrl + '/header'
    entity.header.url = headerUrl
    entity.header.previewUrl = thumbs && thumbs.preview ? headerUrl + '/preview' : headerUrl
    entity.header.staticUrl = thumbs && thumbs.static ? headerUrl + '/static' : headerUrl
  }

  // for bubbles, add media URLs to the world reference
  if (entity.worldRef) {
    populateEntityMediaURLs(entity.worldRef, instanceName, 'world')
  }

  // for sparks, add media URLs to the home world reference
  if (entity.homeWorldRef) {
    populateEntityMediaURLs(entity.homeWorldRef, instanceName, 'world')
  }
}

export function populateMediaURLsInSingleEntity (apiCall, instanceName, entityType) {
  return apiCall.then((entity) => {
    populateEntityMediaURLs(entity, instanceName, entityType)
    return entity
  })
}

export function populateMediaURLsInEntityList (apiCall, instanceName, entityType) {
  return apiCall.then((entityList) => {
    for (const entity of entityList) {
      populateEntityMediaURLs(entity, instanceName, entityType)
    }
    return entityList
  })
}

export function populatePostMediaURLs (post, instanceName, accessToken) {
  if (post.media) {
    const baseUrl = `${base(instanceName, accessToken)}/post/${unwrap(post.id)}/media/`
    for (const mediaItem of post.media) {
      mediaItem.url = baseUrl + unwrapBlob(mediaItem.id)
      mediaItem.previewUrl = mediaItem.url + '/preview'
    }
  }
  if (post.authorRef) {
    populateEntityMediaURLs(post.authorRef, instanceName, 'spark')
  }
  if (post.bubbleRef) {
    populateEntityMediaURLs(post.bubbleRef, instanceName, 'bubble')
  }
}

export function populateNotificationMediaURLs (notification, instanceName, accessToken) {
  if (notification.actor) {
    populateEntityMediaURLs(notification.actor, instanceName, 'spark')
  }
  if (notification.subjectPost) {
    populatePostMediaURLs(notification.subjectPost, instanceName, accessToken)
  }
  if (notification.subjectBubble) {
    populateEntityMediaURLs(notification.subjectBubble, instanceName, 'bubble')
  }
  if (notification.subjectWorld) {
    populateEntityMediaURLs(notification.subjectWorld, instanceName, 'world')
  }
}

export function populateMarketplaceListingMediaURLs (listing, instanceName) {
  let baseUrl = ''
  if (listing.tokenType === 'DigitalArt') {
    baseUrl = `${base(instanceName, null)}/digital-art/${unwrap(listing.tokenAsset)}/content`
  }

  if (listing.object && listing.object.content) {
    const content = listing.object.content
    const thumbs = content.thumbnails
    content.url = baseUrl
    content.previewUrl = thumbs && thumbs.preview ? baseUrl + '/preview' : baseUrl
    content.staticUrl = thumbs && thumbs.static ? baseUrl + '/static' : content.previewUrl
  }
}

export function populateMediaURLsInSingleListing (apiCall, instanceName) {
  return apiCall.then((listing) => {
    populateMarketplaceListingMediaURLs(listing, instanceName)
    return listing
  })
}

export function populateMediaURLsInMarketplaceListings (apiCall, instanceName) {
  return apiCall.then((entityList) => {
    for (const entity of entityList) {
      populateMarketplaceListingMediaURLs(entity, instanceName)
    }
    return entityList
  })
}

export function mediaAssetURL (instanceName, media) {
  return `${basename(instanceName)}/media-asset/${media.uploadID}/${unwrapBlob(media.id)}`
}

export function mediaAssetPreviewURL (instanceName, media) {
  return `${basename(instanceName)}/media-asset/${media.uploadID}/${unwrapBlob(media.id)}/preview`
}

export async function loadSecureMedia (accessToken, url) {
  const timeout = DEFAULT_TIMEOUT
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: auth(accessToken)
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.blob()
    }).then(myBlob => {
      resolve(URL.createObjectURL(myBlob))
    }).catch(error => {
      reject(error)
    })
    setTimeout(() => reject(new Error(`Timed out after ${timeout / 1000} seconds`)), timeout)
  })
}
