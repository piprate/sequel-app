import { realmStore } from '../../_utils/RealmStore'
import { PAGE_HISTORY_SIZE } from '../../_static/pages'

export const listStore = realmStore(/* maxSize */ PAGE_HISTORY_SIZE);

if (process.browser) {
  window.__listStore = listStore // for debugging
}

