import { realmStore } from '../../_utils/RealmStore'
import { PAGE_HISTORY_SIZE } from '../../_static/pages'
import { inBrowser } from '../../_utils/browserOrNode'

export const listStore = realmStore(/* maxSize */ PAGE_HISTORY_SIZE)

if (inBrowser()) {
  window.__listStore = listStore // for debugging
}
