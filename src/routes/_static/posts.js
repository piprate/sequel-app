const privacyOptionPrivate = {
  label: 'intl.private',
  key: 'private',
  icon: '#fa-lock'
}

const privacyOptionSubscribersOnly = {
  label: 'intl.subscribersOnly',
  key: 'subscribers',
  icon: '#fa-users'
}

export const POST_PRIVACY_OPTIONS = [
  {
    label: 'intl.fediverse',
    key: 'fediverse',
    icon: '#fediverse-logo'
  },
  {
    label: 'intl.public',
    key: 'public',
    icon: '#fa-globe'
  },
  privacyOptionSubscribersOnly,
  privacyOptionPrivate
]

export const POST_PRIVACY_OPTIONS_PRIVATE = [
  privacyOptionPrivate
]

export function commentPrivacyOptions (originalPostPrivacy) {
  if (originalPostPrivacy !== 'subscribers') {
    const defaultOption = POST_PRIVACY_OPTIONS.find(_ => _.key === originalPostPrivacy)
    return [
      defaultOption,
      privacyOptionSubscribersOnly
    ]
  } else {
    return [
      privacyOptionSubscribersOnly
    ]
  }
}

export const LONG_POST_LENGTH = 1024
export const LONG_POST_TEXT = 'intl.longPost'
