import { instanceUsers, loggedInInstances, subscriptionRequestCounts } from '../_store/local'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import { getSubRequests } from '../_api/subscriptionRequests'
import { get } from '../_utils/lodash-lite'

export async function updateSubRequestCountIfLockedUser(instanceName) {
  if (!get(instanceUsers.get(), [instanceName, 'locked'])) {
    return
  }

  const accessToken = loggedInInstances.get()[instanceName].access_token

  await cacheFirstUpdateAfter(
    async () => (await getSubRequests(instanceName, accessToken)).length,
    () => database.getSubscriptionRequestCount(instanceName),
    (subReqsCount) => database.setSubscriptionRequestCount(instanceName, subReqsCount),
    (subReqsCount) => {
      const _subscriptionRequestCounts = subscriptionRequestCounts.get()
      _subscriptionRequestCounts[instanceName] = subReqsCount
      subscriptionRequestCounts.set(_subscriptionRequestCounts)
    }
  )
}
