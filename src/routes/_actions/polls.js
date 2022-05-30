import { getPoll as getPollApi, voteOnPoll as voteOnPollApi } from '../_api/polls'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function getPoll (pollId) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    const poll = await getPollApi(_currentInstance, _accessToken, pollId)
    return poll
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToRefreshPoll', { error: (e.message || '') }))
  }
}

export async function voteOnPoll (pollId, choices) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    const poll = await voteOnPollApi(_currentInstance, _accessToken, pollId, choices.map(_ => _.toString()))
    return poll
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToVoteInPoll', { error: (e.message || '') }))
  }
}
