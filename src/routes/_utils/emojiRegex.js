import emojiRegex from 'emoji-regex'
import { thunk } from './thunk'

export const getEmojiRegex = thunk(emojiRegex)
