import { currentInstance, getComposeData, setComposeData } from '../_store/local'
import { uploadMedia } from '../_api/media'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { database } from '../_database/database'
import { get, writable } from "svelte/store";
import { accessToken } from "../_store/instance";

export const uploadingMedia = writable(false);

export async function doMediaUpload (realm, file) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  uploadingMedia.set(true);
  try {
    const response = await uploadMedia(_currentInstance, _accessToken, file)
    const composeMedia = getComposeData(realm, 'media') || []
    if (composeMedia.length === 4) {
      throw new Error('Only 4 media max are allowed')
    }
    await database.setCachedMediaFile(response.id, file)
    composeMedia.push({
      data: response,
      file: { name: file.name },
      description: ''
    })
    setComposeData(realm, {
      media: composeMedia
    })
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.failedToUploadMedia', { error: (e.message || '') }))
  } finally {
    uploadingMedia.set(false);
  }
}

export function deleteMedia (realm, i) {
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
