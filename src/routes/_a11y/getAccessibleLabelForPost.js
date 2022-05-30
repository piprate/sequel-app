import { getSparkAccessibleName } from './getSparkAccessibleName'
import { POST_PRIVACY_OPTIONS } from '../_static/posts'
import { formatIntl } from '../_utils/formatIntl'

function getNotificationText (notification, omitEmojiInDisplayNames) {
  if (!notification) {
    return
  }
  const notificationSparkDisplayName = getSparkAccessibleName(notification.actor, omitEmojiInDisplayNames)
  if (notification.type === 'tmm') {
    return formatIntl('intl.sparkTMMedYou', { spark: notificationSparkDisplayName })
  } else if (notification.type === 'favourite') {
    return formatIntl('intl.sparkFavoritedYou', { spark: notificationSparkDisplayName })
  }
}

function getPrivacyText (visibility) {
  for (const option of POST_PRIVACY_OPTIONS) {
    if (option.key === visibility) {
      return option.label
    }
  }
}

function cleanupText (text) {
  return text.replace(/\s+/g, ' ').trim()
}

export function getAccessibleLabelForPost (postAuthor, plainTextContent,
  shortInlineFormattedDate, spoilerText, showContent,
  notification, visibility, omitEmojiInDisplayNames,
  disableLongAriaLabels, showMedia, showPoll) {
  const postAuthorDisplayName = getSparkAccessibleName(postAuthor, omitEmojiInDisplayNames)
  const contentTextToShow = (showContent || !spoilerText)
    ? cleanupText(plainTextContent)
    : formatIntl('intl.contentWarningContent', { spoiler: cleanupText(spoilerText) })
  const mediaTextToShow = showMedia && 'intl.hasMedia'
  const pollTextToShow = showPoll && 'intl.hasPoll'
  const privacyText = getPrivacyText(visibility)

  if (disableLongAriaLabels) {
    return formatIntl('intl.shortPostLabel', { privacy: privacyText, spark: postAuthorDisplayName })
  }

  const values = [
    getNotificationText(notification, omitEmojiInDisplayNames),
    postAuthorDisplayName,
    contentTextToShow,
    mediaTextToShow,
    pollTextToShow,
    shortInlineFormattedDate,
    privacyText
  ].filter(Boolean)

  return values.join(', ')
}
