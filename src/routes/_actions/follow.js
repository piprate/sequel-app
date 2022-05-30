import { followAccount, unfollowAccount } from '../_api/follow'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    let relationship
    if (follow) {
      relationship = await followAccount(_currentInstance, _accessToken, accountId)
    } else {
      relationship = await unfollowAccount(_currentInstance, _accessToken, accountId)
    }
    await updateLocalRelationship(_currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */ toast.say(follow ? 'intl.followedAccount' : 'intl.unfollowedAccount')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(follow
      ? formatIntl('intl.unableToFollow', { error: (e.message || '') })
      : formatIntl('intl.unableToUnfollow', { error: (e.message || '') })
    )
  }
}
