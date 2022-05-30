import { followRequestCounts, verifyCredentials, loggedInInstances } from '../_store/local'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import { getFollowRequests } from '../_api/followRequests'
import { get } from '../_utils/lodash-lite'

export async function updateFollowRequestCountIfLockedAccount (instanceName) {
  if (!get(verifyCredentials.get(), [instanceName, 'locked'])) {
    return
  }

  const accessToken = loggedInInstances.get()[instanceName].access_token

  await cacheFirstUpdateAfter(
    async () => (await getFollowRequests(instanceName, accessToken)).length,
    () => database.getFollowRequestCount(instanceName),
    followReqsCount => database.setFollowRequestCount(instanceName, followReqsCount),
    followReqsCount => {
      const _followRequestCounts = followRequestCounts.get();
      _followRequestCounts[instanceName] = followReqsCount
      followRequestCounts.set(_followRequestCounts);
    }
  )
}
