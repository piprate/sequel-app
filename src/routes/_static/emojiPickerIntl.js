import { DEFAULT_LOCALE, LOCALE } from './intl'

export const emojiPickerDataSource = `/emoji-${LOCALE}.json`

// this should be undefined for English; it's already bundled with emoji-picker-element
export const getEmojiPickerI18n = async () => {
  if (LOCALE !== DEFAULT_LOCALE) {
    return (await import(`../../intl/emoji-picker/${LOCALE}.js`)).default
  }
}

// To avoid creating a new IDB database named emoji-picker-en-US, just
// reuse the existing default "en" one (otherwise people will end up with
// a stale database taking up useless space)
export const emojiPickerLocale = LOCALE === 'en-US' ? 'en' : LOCALE
