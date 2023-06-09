import { composeData, currentInstance, getComposeData, setComposeData } from '../_store/local'
import {
  autosuggestSearchResults,
  autosuggestSearchText,
  autosuggestSelected,
  composeSelectionStart,
  currentComposeRealm,
  rootAutosuggestSearchResults,
  setForAutosuggest
} from '../_store/autosuggest'
import { get } from 'svelte/store'
import { get as lodashGet } from '../_utils/lodash-lite'

// TODO: move to _components/compose

const emojiMapper = (emoji) => (emoji.unicode ? emoji.unicode : `:${emoji.shortcodes[0]}:`)
const hashtagMapper = (hashtag) => `#${hashtag.name}`
const entityMapper = (entity) => entity.name

async function insertTextAtPosition(realm, text, startIndex, endIndex) {
  const oldText = getComposeData(realm, 'text')
  const pre = oldText.substring(0, startIndex)
  const post = oldText.substring(endIndex)
  const newText = post ? `${pre}${text} ${post}` : `${pre}${text}`
  setComposeData(realm, { text: newText })
  setForAutosuggest(rootAutosuggestSearchResults, currentInstance.get(), realm, [])
}

export async function insertName(realm, entity, startIndex, endIndex) {
  await insertTextAtPosition(realm, entityMapper(entity), startIndex, endIndex)
}

export async function insertHashtag(realm, hashtag, startIndex, endIndex) {
  await insertTextAtPosition(realm, hashtagMapper(hashtag), startIndex, endIndex)
}

export async function insertEmojiAtPosition(realm, emoji, startIndex, endIndex) {
  await insertTextAtPosition(realm, emojiMapper(emoji), startIndex, endIndex)
}

async function clickSelectedItem(realm, resultMapper) {
  const _composeSelectionStart = get(composeSelectionStart)
  const result = get(autosuggestSearchResults)[get(autosuggestSelected)]
  const startIndex = _composeSelectionStart - get(autosuggestSearchText).length
  const endIndex = _composeSelectionStart
  await insertTextAtPosition(realm, resultMapper(result), startIndex, endIndex)
}

export async function clickSelectedAutosuggestionName(realm) {
  return clickSelectedItem(realm, entityMapper)
}

export async function clickSelectedAutosuggestionHashtag(realm) {
  return clickSelectedItem(realm, hashtagMapper)
}

export async function clickSelectedAutosuggestionEmoji(realm) {
  return clickSelectedItem(realm, emojiMapper)
}

export function updateMentions(item, realm) {
  let mentions = lodashGet(composeData.get(), [currentInstance.get(), realm, 'mentions'], [])

  if (item.type && !mentions.find((mention) => mention.id === item.id)) {
    mentions = mentions.concat({
      id: item.id,
      name: item.name,
      entityType: item.type
    })

    setComposeData(realm, { mentions })
  }
}

export function selectAutosuggestItem(item) {
  const _composeSelectionStart = get(composeSelectionStart)
  const startIndex = _composeSelectionStart - get(autosuggestSearchText).length
  const endIndex = _composeSelectionStart
  if (item.shortcodes) {
    /* no await */
    insertEmojiAtPosition(currentComposeRealm.get(), item, startIndex, endIndex)
  } else if (item.rank) {
    // hashtag
    /* no await */
    insertHashtag(currentComposeRealm.get(), item, startIndex, endIndex)
  } else {
    /* no await */
    insertName(currentComposeRealm.get(), item, startIndex, endIndex)
  }
}
