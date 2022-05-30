import { deleteStatus } from '../_api/delete'
import { toast } from '../_components/toast/toast'
import { deleteStatus as deleteStatusLocally } from './deleteStatuses'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function doDeleteStatus (statusId) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    const deletedStatus = await deleteStatus(_currentInstance, _accessToken, statusId)
    deleteStatusLocally(_currentInstance, statusId)
    /* no await */ toast.say('intl.statusDeleted')
    return deletedStatus
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToDelete', { error: (e.message || '') }))
    throw e
  }
}
