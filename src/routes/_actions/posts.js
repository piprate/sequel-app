import { database } from '../_database/database'

export async function getNotificationIdsForPosts (instanceName, postIds) {
  return database.getNotificationIdsForPosts(instanceName, postIds)
}
