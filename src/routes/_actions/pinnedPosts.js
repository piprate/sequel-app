import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import { getPinnedPosts } from '../_api/pinnedPosts'
import { currentInstance, pinnedPosts } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function updatePinnedPostsForSpark(sparkId, asSpark) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)

  await cacheFirstUpdateAfter(
    () => getPinnedPosts(_currentInstance, _accessToken, sparkId, asSpark),
    async () => {
      const _pinnedPosts = await database.getPinnedPosts(_currentInstance, sparkId, asSpark)
      if (!_pinnedPosts || !_pinnedPosts.every(Boolean)) {
        throw new Error('missing pinned posts in idb')
      }
      return _pinnedPosts
    },
    (posts) => database.insertPinnedPosts(_currentInstance, sparkId, posts, asSpark),
    (posts) => {
      const _pinnedPosts = pinnedPosts.get()
      _pinnedPosts[_currentInstance] = _pinnedPosts[_currentInstance] || {}
      _pinnedPosts[_currentInstance][sparkId] = posts
      pinnedPosts.set(_pinnedPosts)
    }
  )
}
