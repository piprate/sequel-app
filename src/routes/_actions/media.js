import { clearComposeData, currentInstance, getComposeData, setComposeData } from '../_store/local'
import { mediaAssetPreviewURL, mediaAssetURL, uploadMedia, uploadTokenMedia } from '../_api/media'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { database } from '../_database/database'
import { get, writable } from 'svelte/store'
import { accessToken } from '../_store/instance'

export const uploadingMedia = writable('')

export async function doMediaUpload (realm, field, file, calculateBlurhash, mediaProfile) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  uploadingMedia.set(realm + field)
  try {
    const response = await uploadMedia(_currentInstance, _accessToken, file, calculateBlurhash, mediaProfile)

    await database.setCachedMediaFile(response.id, file)

    const mediaObj = {
      data: response,
      file: { name: file.name },
      url: mediaAssetURL(_currentInstance, response),
      previewUrl: mediaAssetPreviewURL(_currentInstance, response),
      description: ''
    }

    let obj
    if (field) {
      obj = {
        [field]: mediaObj
      }
    } else {
      // if (composeMedia.length === 4) {
      //   throw new Error('Only 4 media max are allowed');
      // }

      const composeMedia = getComposeData(realm, 'media') || []
      composeMedia.push(mediaObj)
      obj = {
        media: composeMedia
      }
    }

    setComposeData(realm, obj)
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.failedToUploadMedia', { error: (e.message || '') }))
  } finally {
    uploadingMedia.set('')
  }
}

export async function doTokenMediaUpload (realm, field, nft, calculateBlurhash, mediaProfile) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  uploadingMedia.set(realm + field)
  try {
    const form = {
      source: nft.source,
      token: parseInt(nft.token),
      account: nft.account,
      asset: nft.asset || '',
      blurhash: calculateBlurhash,
      profile: mediaProfile,
    }
    const response = await uploadTokenMedia(_currentInstance, _accessToken, form)

    const mediaObj = {
      data: response,
      file: { name: nft.name },
      url: mediaAssetURL(_currentInstance, response),
      previewUrl: mediaAssetPreviewURL(_currentInstance, response),
      description: ''
    }

    let obj
    if (field) {
      obj = {
        [field]: mediaObj
      }
    } else {
      const composeMedia = getComposeData(realm, 'media') || []
      composeMedia.push(mediaObj)
      obj = {
        media: composeMedia
      }
    }

    setComposeData(realm, obj)
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.failedToUploadMedia', { error: (e.message || '') }))
  } finally {
    uploadingMedia.set('')
  }
}

export function deleteMedia (realm, field, i) {
  if (field) {
    clearComposeData(realm, field)
  } else {
    const composeMedia = getComposeData(realm, 'media')
    composeMedia.splice(i, 1)

    setComposeData(realm, {
      media: composeMedia
    })
    if (!composeMedia.length) {
      const contentWarningShown = getComposeData(realm, 'contentWarningShown')
      const contentWarning = getComposeData(realm, 'contentWarning')
      setComposeData(realm, {
        sensitive: contentWarningShown && contentWarning // reset sensitive if the last media is deleted
      })
    }
  }
}

export function prepareMediaItem (mediaItem) {
  if (mediaItem.data.meta && mediaItem.data.meta.focus) {
    mediaItem.data.meta.focus.x = mediaItem.focusX || 0
    mediaItem.data.meta.focus.y = mediaItem.focusY || 0
  }
  if (mediaItem.description) {
    mediaItem.data.description = mediaItem.description
  }
}
