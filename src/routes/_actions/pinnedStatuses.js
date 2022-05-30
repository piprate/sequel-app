import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import {
  getPinnedStatuses
} from '../_api/pinnedStatuses'
import { currentInstance, pinnedStatuses } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function updatePinnedStatusesForAccount (accountId) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);

  await cacheFirstUpdateAfter(
    () => getPinnedStatuses(_currentInstance, _accessToken, accountId),
    async () => {
      const pinnedStatuses = await database.getPinnedStatuses(_currentInstance, accountId)
      if (!pinnedStatuses || !pinnedStatuses.every(Boolean)) {
        throw new Error('missing pinned statuses in idb')
      }
      return pinnedStatuses
    },
    statuses => database.insertPinnedStatuses(_currentInstance, accountId, statuses),
    statuses => {
      const _pinnedStatuses = pinnedStatuses.get();
      _pinnedStatuses[_currentInstance] = _pinnedStatuses[_currentInstance] || {}
      _pinnedStatuses[_currentInstance][accountId] = statuses
      pinnedStatuses.set(_pinnedStatuses);
    }
  )
}
