import { autoplayGifs } from '../local'
import { currentCustomEmoji } from '../instance'
import * as emojiDatabase from '../../_utils/emojiDatabase'
import { convertCustomEmojiToEmojiPickerFormat } from '../../_utils/convertCustomEmojiToEmojiPickerFormat'
import { get } from 'svelte/store'

export function customEmojiObservers () {
  if (!process.browser) {
    return
  }

  function setEmoji (currentEmoji, autoplayGifs) {
    // FIXME: the if statement is there to avoid a console warning. Review after re-enabling custom emoji.
    if (currentEmoji && currentEmoji.length) {
      const customEmojiInEmojiPickerFormat = convertCustomEmojiToEmojiPickerFormat(currentEmoji, autoplayGifs)
      emojiDatabase.setCustomEmoji(customEmojiInEmojiPickerFormat)
    }
  }

  currentCustomEmoji.subscribe(_currentCustomEmoji => {
    setEmoji(_currentCustomEmoji, autoplayGifs.get())
  })

  autoplayGifs.subscribe(_autoplayGifs => {
    setEmoji(get(currentCustomEmoji), _autoplayGifs)
  })
}
