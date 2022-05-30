import { getTimeline } from '../_api/timelines'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function getRecentStatusesForAccount (accountId) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  return (await getTimeline(_currentInstance, _accessToken, `account/${accountId}`, null, null, 20)).items
}
