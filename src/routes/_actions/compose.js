import { getComposeData, setComposeData, clearComposeData, currentInstance, online } from '../_store/local'
import { toast } from '../_components/toast/toast'
import { postStatus as postStatusToServer } from '../_api/statuses'
import { addStatusOrNotification } from './addStatusOrNotification'
import { database } from '../_database/database'
import { emit } from '../_utils/eventBus'
import { putMediaMetadata } from '../_api/media'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { formatIntl } from '../_utils/formatIntl'
import { get, writable } from "svelte/store";
import { accessToken, currentVerifyCredentials } from "../_store/instance";

export const postingStatus = writable(false);

export async function insertHandleForReply (statusId) {
  const _currentInstance = currentInstance.get();
  const status = await database.getStatus(_currentInstance, statusId)
  const originalStatus = status.reblog || status
  let accounts = [originalStatus.account].concat(originalStatus.mentions || [])
    .filter(account => account.id !== get(currentVerifyCredentials).id)
  // Pleroma includes account in mentions as well, so make uniq https://github.com/nolanlawson/pinafore/issues/1591
  accounts = uniqBy(accounts, _ => _.id)
  if (!getComposeData(statusId, 'text') && accounts.length) {
    setComposeData(statusId, {
      text: accounts.map(account => `@${account.acct} `).join('')
    })
  }
}

export async function postStatus (realm, text, inReplyToId, mediaIds,
  sensitive, spoilerText, visibility,
  mediaDescriptions, inReplyToUuid, poll, mediaFocalPoints) {

  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);

  if (!online.get()) {
    /* no await */ toast.say('intl.cannotPostOffline')
    return
  }

  text = text || ''

  const mediaMetadata = (mediaIds || []).map((mediaId, idx) => {
    return {
      description: mediaDescriptions && mediaDescriptions[idx],
      focalPoint: mediaFocalPoints && mediaFocalPoints[idx]
    }
  })

  postingStatus.set(true);
  try {
    await Promise.all(mediaMetadata.map(async ({ description, focalPoint }, i) => {
      description = description || ''
      focalPoint = focalPoint || [0, 0]
      focalPoint[0] = focalPoint[0] || 0
      focalPoint[1] = focalPoint[1] || 0
      if (description || focalPoint[0] || focalPoint[1]) {
        return putMediaMetadata(_currentInstance, _accessToken, mediaIds[i], description, focalPoint)
      }
    }))
    const status = await postStatusToServer(_currentInstance, _accessToken, text,
      inReplyToId, mediaIds, sensitive, spoilerText, visibility, poll, mediaFocalPoints)
    addStatusOrNotification(_currentInstance, 'home', status)
    clearComposeData(realm)
    emit('postedStatus', realm, inReplyToUuid)
    scheduleIdleTask(() => (mediaIds || []).forEach(mediaId => database.deleteCachedMediaFile(mediaId))) // clean up media cache
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToPost', { error: (e.message || '') }))
  } finally {
    postingStatus.set(false);
  }
}

export function setReplySpoiler (realm, spoiler) {
  const contentWarning = getComposeData(realm, 'contentWarning')
  const contentWarningShown = getComposeData(realm, 'contentWarningShown')
  if (typeof contentWarningShown !== 'undefined' || contentWarning) {
    return // user has already interacted with the CW
  }
  setComposeData(realm, {
    contentWarning: spoiler,
    contentWarningShown: true
  })
}

const PRIVACY_LEVEL = {
  direct: 1,
  private: 2,
  unlisted: 3,
  public: 4
}

export function setReplyVisibility (realm, replyVisibility) {
  // return the most private between the user's preferred default privacy
  // and the privacy of the status they're replying to
  const postPrivacy = getComposeData(realm, 'postPrivacy')
  if (typeof postPrivacy !== 'undefined') {
    return // user has already set the postPrivacy
  }
  const defaultVisibility = get(currentVerifyCredentials).source.privacy
  const visibility = PRIVACY_LEVEL[replyVisibility] < PRIVACY_LEVEL[defaultVisibility]
    ? replyVisibility
    : defaultVisibility
  setComposeData(realm, { postPrivacy: visibility })
}
