import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import * as emojiDatabase from '../_utils/emojiDatabase'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { testEmojiSupported } from '../_utils/testEmojiSupported'
import { mark, stop } from '../_utils/marks'
import {
  rootAutosuggestSearchResults,
  rootAutosuggestSelected,
  rootAutosuggestType,
  setForCurrentAutosuggest
} from '../_store/autosuggest'

async function searchEmoji (searchText) {
  let emojis = await emojiDatabase.findBySearchQuery(searchText)

  const results = []

  if (searchText.startsWith(':') && searchText.endsWith(':')) {
    // exact shortcode search
    const shortcode = searchText.substring(1, searchText.length - 1).toLowerCase()
    emojis = emojis.filter(_ => _.shortcodes.includes(shortcode))
  }

  mark('testEmojiSupported')
  for (const emoji of emojis) {
    if (results.length === SEARCH_RESULTS_LIMIT) {
      break
    }
    if (emoji.url || testEmojiSupported(emoji.unicode)) { // emoji.url is a custom emoji
      results.push(emoji)
    }
  }
  stop('testEmojiSupported')
  return results
}

export function doEmojiSearch (searchText) {
  let canceled = false

  scheduleIdleTask(async () => {
    if (canceled) {
      return
    }
    const results = await searchEmoji(searchText)
    if (canceled) {
      return
    }
    setForCurrentAutosuggest(rootAutosuggestType, 'emoji')
    setForCurrentAutosuggest(rootAutosuggestSelected, 0)
    setForCurrentAutosuggest(rootAutosuggestSearchResults, results)
  })

  return {
    cancel: () => {
      canceled = true
    }
  }
}
