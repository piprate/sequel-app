import {
  cacheFirstUpdateAfter,
  cacheFirstUpdateOnlyIfNotInCache
} from '../_utils/sync'
import { database } from '../_database/database'
import { getCustomEmoji } from '../_api/emoji'
import { loggedInInstances, customEmoji, getComposeData, setComposeData } from '../_store/local'
import { composeSelectionStart } from '../_store/autosuggest'
import isEqual from 'lodash-es/isEqual'
import { get } from 'svelte/store';

async function syncEmojiForInstance (instanceName, syncMethod) {
  await syncMethod(
      () => {
        const instances = loggedInInstances.get();
        const accessToken = instances[instanceName].access_token
        return getCustomEmoji(instanceName, accessToken)
      },
      () => database.getCustomEmoji(instanceName),
      emoji => database.setCustomEmoji(instanceName, emoji),
      emoji => {
        const _customEmoji = customEmoji.get();
        if (!isEqual(_customEmoji[instanceName], emoji)) { // avoid triggering updates if nothing's changed
          _customEmoji[instanceName] = emoji;
          customEmoji.set(_customEmoji);
        }
      }
  )
}

export async function updateCustomEmojiForInstance (instanceName) {
  await syncEmojiForInstance(instanceName, cacheFirstUpdateAfter)
}

export async function setupCustomEmojiForInstance (instanceName) {
  await syncEmojiForInstance(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}

export function insertEmoji (realm, emoji) {
  const emojiText = emoji.unicode || `:${emoji.name}:`
  const idx = get(composeSelectionStart) || 0
  const oldText = getComposeData(realm, 'text') || ''
  const pre = oldText.substring(0, idx)
  const post = oldText.substring(idx)
  const newText = `${pre}${emojiText} ${post}`
  setComposeData(realm, { text: newText })
}
