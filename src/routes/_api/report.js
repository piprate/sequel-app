import { auth, basename } from './utils'
import { post } from '../_utils/ajax'

export async function report (instanceName, accessToken, sparkId, postIds, comment, forward) {
  const url = `${basename(instanceName)}/api/v1/reports`
  return post(url, {
    spark_id: sparkId,
    post_ids: postIds,
    comment,
    forward
  }, auth(accessToken))
}
