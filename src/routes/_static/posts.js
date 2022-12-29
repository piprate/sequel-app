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

export const POST_INPUT_FORMATS = [
  {
    key: 'txt',
    label: 'Plain Text',
    icon: '#fa-text'
  },
  {
    key: 'md',
    label: 'Markdown',
    icon: '#fa-markdown'
  },
  {
    key: 'gmi',
    label: 'GemText',
    icon: '#fa-gemtext'
  }
]

export const POST_PRIVACY_OPTIONS_PRIVATE = [
  privacyOptionPrivate
]

export function postPrivacyOptions (defaultVisibility, federationMode) {
  if (defaultVisibility === 'private') {
    return POST_PRIVACY_OPTIONS_PRIVATE
  }
  if (federationMode === 'disabled') {
    return POST_PRIVACY_OPTIONS.filter(option => option.key !== 'fediverse')
  }
  return POST_PRIVACY_OPTIONS
}

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

export const MAX_POST_LENGTH = 2500
export const LONG_POST_LENGTH = 1500
export const LONG_POST_TEXT = 'intl.longPost'
