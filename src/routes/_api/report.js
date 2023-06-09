import { basename, sequelAuth } from './utils'
import { post } from '../_utils/ajax'
import { accessToken, currentSparkId } from '../_store/instance'
import { get } from 'svelte/store'
import { currentInstance } from '../_store/local'

export async function report(postIds, sparkId, comment) {
  const _currentInstance = currentInstance.get()
  const _currentSpark = get(currentSparkId)
  const _accessToken = get(accessToken)
  const url = `${basename(_currentInstance)}/report`

  return post(
    url,
    {
      comment,
      reportedBy: _currentSpark,
      posts: postIds,
      subject: sparkId,
      subjectType: 'Spark'
    },
    sequelAuth(_accessToken, _currentSpark)
  )
}
