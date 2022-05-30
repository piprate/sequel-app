import { setShowReblogs as setShowReblogsApi } from '../_api/showReblogs'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setShowReblogs(accountId, showReblogs, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    const relationship = await setShowReblogsApi(_currentInstance, _accessToken, accountId, showReblogs)
    await updateLocalRelationship(_currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */
      toast.say(showReblogs ? 'intl.showingReblogs' : 'intl.hidingReblogs')
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(showReblogs
      ? formatIntl('intl.unableToShowReblogs', { error: (e.message || '') })
      : formatIntl('intl.unableToHideReblogs', { error: (e.message || '') })
    )
  }
}
