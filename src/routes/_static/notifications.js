import { formatIntl } from '../_utils/formatIntl'
import parse from 'format-message-parse'
import { getSparkAccessibleName } from '../_a11y/getSparkAccessibleName'

const NOTIFICATION_TYPES = {
  tmm: {
    icon: '#fa-fire',
    actionText: 'intl.tmmedYou',
    label: parse('intl.labelTmmedYou')
  },
  mention: {
    icon: '#fa-user',
    actionText: 'intl.mentionedYou',
    label: parse('intl.labelMentionedYou')
  },
  comment: {
    icon: '#fa-reply',
    actionText: 'intl.commented',
    label: parse('intl.labelCommented')
  },
  join_bubble: {
    icon: '#fa-sign-in',
    actionText: 'intl.joinedHeader',
    label: parse('intl.labelJoinedBubble')
  },
  leave_bubble: {
    icon: '#fa-sign-out',
    actionText: 'intl.leftHeader',
    label: parse('intl.labelLeftBubble')
  },
  subscription: {
    icon: '#fa-user-plus',
    actionText: 'intl.subscribedToYourPosts',
    label: parse('intl.labelSubscribedToYourPosts')
  },
  mod_offer: {
    icon: '#fa-gift',
    actionText: 'intl.offeredNFT',
    label: parse('intl.labelOfferedNFT')
  }
}

const DEFAULT_ICON = '#fa-star'

export function notificationIcon(notificationType) {
  const val = NOTIFICATION_TYPES[notificationType]
  return val ? val.icon : DEFAULT_ICON
}

export function notificationActionText(notificationType) {
  const val = NOTIFICATION_TYPES[notificationType]
  return val ? val.actionText : ''
}

export function notificationLabel(notification, omitEmojiInDisplayNames) {
  const val = NOTIFICATION_TYPES[notification.type]

  if (!val) {
    return ''
  }

  const params = {}

  if (notification.type !== 'comment') {
    params.name = getSparkAccessibleName(notification.actor, omitEmojiInDisplayNames)
  }
  if (notification.type === 'join_bubble' || notification.type === 'leave_bubble') {
    params.bubble = getSparkAccessibleName(notification.subjectBubble, omitEmojiInDisplayNames)
  } else if (notification.type === 'mod_offer') {
    params.token = getSparkAccessibleName(notification.subjectListing.object, omitEmojiInDisplayNames)
  }

  return formatIntl(val.label, params)
}
