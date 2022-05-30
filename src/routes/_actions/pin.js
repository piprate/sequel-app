import { toast } from '../_components/toast/toast'
import { pinStatus, unpinStatus } from '../_api/pin'
import { database } from '../_database/database'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, setStatusPinned } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setStatusPinnedOrUnpinned (statusId, pinned, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    if (pinned) {
      await pinStatus(_currentInstance, _accessToken, statusId)
    } else {
      await unpinStatus(_currentInstance, _accessToken, statusId)
    }
    if (toastOnSuccess) {
      /* no await */ toast.say(pinned ? 'intl.pinnedStatus' : 'intl.unpinnedStatus')
    }
    setStatusPinned(_currentInstance, statusId, pinned)
    await database.setStatusPinned(_currentInstance, statusId, pinned)
    emit('updatePinnedStatuses')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(pinned
      ? formatIntl('intl.unableToPinStatus', { error: (e.message || '') })
      : formatIntl('intl.unableToUnpinStatus', { error: (e.message || '') })
    )
  }
}
