import { dbPromise, getDatabase } from '../databaseLifecycle'
import { getInCache, hasInCache, postsCache } from '../cache'
import { POSTS_STORE } from '../constants'
import { cachePost, sparkSpecificPostId } from './cachePost'
import { putPost } from './insertion'

//
// update posts
//

async function updatePost(instanceName, postId, updateFunc, asSpark) {
  const db = await getDatabase(instanceName)
  const cacheId = sparkSpecificPostId(postId, asSpark)
  if (hasInCache(postsCache, instanceName, cacheId)) {
    const post = getInCache(postsCache, instanceName, cacheId)
    updateFunc(post)
    cachePost(post, instanceName, asSpark)
  }
  return dbPromise(db, POSTS_STORE, 'readwrite', (postsStore) => {
    postsStore.get(cacheId).onsuccess = (e) => {
      const post = e.target.result
      updateFunc(post)
      putPost(postsStore, post, asSpark)
    }
  })
}

export async function setPostTMMed(instanceName, postId, tmmed, asSpark) {
  return updatePost(
    instanceName,
    postId,
    (post) => {
      const delta = (tmmed ? 1 : 0) - (post.tmmed ? 1 : 0)
      post.tmm = tmmed
      post.tmmCount = (post.tmmCount || 0) + delta
    },
    asSpark
  )
}

export async function setPostPinned(instanceName, postId, pinned, asSpark) {
  return updatePost(
    instanceName,
    postId,
    (post) => {
      post.pinned = pinned
    },
    asSpark
  )
}

export async function setPostMuted(instanceName, postId, muted, asSpark) {
  return updatePost(
    instanceName,
    postId,
    (post) => {
      post.muted = muted
    },
    asSpark
  )
}

export async function setPostBookmarked(instanceName, postId, bookmarked, asSpark) {
  return updatePost(
    instanceName,
    postId,
    (post) => {
      post.bookmarked = bookmarked
    },
    asSpark
  )
}

export async function updateEditedPost(instanceName, newPost, asSpark) {
  return updatePost(
    instanceName,
    newPost.id,
    (post) => {
      Object.assign(post, newPost)
    },
    asSpark
  )
}
