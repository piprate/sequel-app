import {
  clearComposeData,
  currentInstance,
  currentTimeline,
  getComposeData,
  observedBubble,
  online,
  setComposeData
} from '../_store/local'
import { toast } from '../_components/toast/toast'
import { sendPost } from '../_api/posts'
import { addPostOrNotification } from './addPostOrNotification'
import { database } from '../_database/database'
import { emit } from '../_utils/eventBus'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { formatIntl } from '../_utils/formatIntl'
import { get, writable } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { prepareMediaItem } from './media'
import { updateEditedPost } from '../_database/timelines/updatePost'
import { unwrap, wrap } from '../_utils/mapper'

export const publishingPost = writable(false)

export async function canPost (bubbleId, asSpark, isComment = false) {
  const _currentInstance = currentInstance.get()
  const bubble = await database.getBubble(_currentInstance, bubbleId)
  if (!bubble) {
    return false
  }
  const relationship = await database.getBubbleRelationship(_currentInstance, bubbleId)

  if (relationship && relationship.referrer === asSpark) {
    switch (relationship.memberType) {
      case 'owner':
      case 'moderator':
        return true
      case 'writer':
        return bubble.writerMode !== 'none'
      default:
        return isComment && bubble.observerMode === 'public' && bubble.writerMode === 'public_comments'
    }
  }

  return false
}

export async function publishPost (realm, bubbleId, asSpark, text, originalPostId, inReplyToId, media, visibility, inReplyToUuid, textFormatKey, mentions) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)

  if (!online.get()) {
    /* no await */
    toast.say('intl.cannotPostOffline')
    return
  }

  text = text || ''
  media = media || []

  for (const mediaItem of media) {
    prepareMediaItem(mediaItem)
  }
  const mediaToSend = media.map(_ => _.data)
  for (const [index, mediaItem] of mediaToSend.entries()) {
    const duplicateIndex = mediaToSend.findIndex((_, i) => {
      return _.id === mediaItem.id && index !== i
    })

    if (duplicateIndex > index) mediaToSend.splice(duplicateIndex, 1)
  }

  publishingPost.set(true)
  try {
    const post = await sendPost(_currentInstance, _accessToken, bubbleId, asSpark, text, originalPostId, inReplyToId, mediaToSend, visibility, textFormatKey, mentions)
    if (originalPostId) {
      updateEditedPost(_currentInstance, post, asSpark)
      emit('postUpdated')
    } else {
      const insertionTimeline = inReplyToId ? `post/${unwrap(inReplyToId)}` : get(currentTimeline)
      addPostOrNotification(_currentInstance, insertionTimeline, post, asSpark)
    }
    clearComposeData(realm)
    setComposeData(realm, { postInputFormat: textFormatKey })
    emit('publishedPost', realm, inReplyToUuid)
    scheduleIdleTask(() => {
      media.forEach(mediaItem => database.deleteCachedMediaFile(mediaItem.data.id)) // clean up media cache

      // preemptively update bubble stats
      const bubble = get(observedBubble)
      if (bubble && bubble.id === wrap(bubbleId)) {
        bubble.postCount++
        observedBubble.set(bubble)
      }
    })
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.unableToPost', { error: (e.message || '') }))
  } finally {
    publishingPost.set(false)
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
  private: 1,
  subscribers: 2,
  public: 3,
  fediverse: 4
}

export function setReplyVisibility (realm, replyVisibility) {
  // // return the most private between the user's preferred default privacy
  // // and the privacy of the post they're replying to
  // const postPrivacy = getComposeData(realm, 'postPrivacy')
  // if (typeof postPrivacy !== 'undefined') {
  //   return // user has already set the postPrivacy
  // }
  // const _observedBubbleRelationship = observedBubbleRelationship.get()
  // const defaultVisibility = (_observedBubbleRelationship && _observedBubbleRelationship.defaultVisibility) || 'private'
  // const visibility = PRIVACY_LEVEL[replyVisibility] < PRIVACY_LEVEL[defaultVisibility]
  //   ? replyVisibility
  //   : defaultVisibility
  setComposeData(realm, {
    originalPostPrivacy: replyVisibility,
    postPrivacy: replyVisibility
  })
}
