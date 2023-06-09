import { emojifyText } from './emojifyText'

export function massageUserText(text, emojis, $autoplayGifs) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs)
  return text
}
