import { doEmojiSearch } from '../../_actions/autosuggestEmojiSearch'
import { doAccountSearch } from '../../_actions/autosuggestAccountSearch'
import { doHashtagSearch } from '../../_actions/autosuggestHashtagSearch'
import {
  autosuggestSearchText,
  composeFocused, getForCurrentAutosuggest,
  rootAutosuggestSearchResults,
  rootAutosuggestSelected, rootAutosuggestSelecting,
  setForCurrentAutosuggest
} from "../autosuggest";
import { get } from 'svelte/store';

function resetAutosuggest() {
  setForCurrentAutosuggest(rootAutosuggestSelected, 0);
  setForCurrentAutosuggest(rootAutosuggestSearchResults, []);
}

export function autosuggestObservers() {
  let lastSearch

  autosuggestSearchText.subscribe(_autosuggestSearchText => {
    // cancel any inflight XHRs or other operations
    if (lastSearch) {
      lastSearch.cancel()
      lastSearch = null
    }
    // autosuggestSelecting indicates that the user has pressed Enter or clicked on an item
    // and the results are being processed. Returning early avoids a flash of searched content.
    const _composeFocused = get(composeFocused);
    const autosuggestSelecting = getForCurrentAutosuggest(rootAutosuggestSelecting);
    if (!_composeFocused || !_autosuggestSearchText || autosuggestSelecting) {
      resetAutosuggest()
      return
    }

    if (_autosuggestSearchText.startsWith(':')) { // emoji
      lastSearch = doEmojiSearch(_autosuggestSearchText)
    } else if (_autosuggestSearchText.startsWith('#')) { // hashtag
      lastSearch = doHashtagSearch(_autosuggestSearchText)
    } else { // account
      lastSearch = doAccountSearch(_autosuggestSearchText)
    }
  })
}
