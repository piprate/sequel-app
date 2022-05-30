import { emojifyText } from './emojifyText'
import { massagePostPlainText } from './massagePostPlainText'

export function massageUserText (text, emojis, $autoplayGifs) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs)
  text = massagePostPlainText(text)
  return text
}
