import { cachePost } from './cachePost'
import { dbPromise, getDatabase } from '../databaseLifecycle'
import { BUBBLES_STORE, PINNED_POSTS_STORE, POSTS_STORE, SPARKS_STORE } from '../constants'
import { createPinnedPostId, createPinnedPostKeyRange } from '../keys'
import { storePost } from './insertion'
import { fetchPost } from './fetchPost'

export async function insertPinnedPosts (instanceName, sparkId, posts, asSpark) {
  for (const post of posts) {
    cachePost(post, instanceName, asSpark)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [PINNED_POSTS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [pinnedPostsStore, postsStore, sparksStore, bubblesStore] = stores

    const keyRange = createPinnedPostKeyRange(sparkId)
    pinnedPostsStore.getAll(keyRange).onsuccess = e => {
      // if there was e.g. 1 pinned post before and 2 now, then we need to delete the old one
      const existingPinnedPosts = e.target.result
      for (let i = posts.length; i < existingPinnedPosts.length; i++) {
        pinnedPostsStore.delete(createPinnedPostKeyRange(sparkId, i))
      }
      posts.forEach((post, i) => {
        storePost(postsStore, sparksStore, bubblesStore, post, asSpark)
        pinnedPostsStore.put(post.id, createPinnedPostId(sparkId, i))
      })
    }
  })
}

export async function getPinnedPosts (instanceName, sparkId, asSpark) {
  const storeNames = [PINNED_POSTS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [pinnedPostsStore, postsStore, sparksStore, bubblesStore] = stores
    const keyRange = createPinnedPostKeyRange(sparkId)
    pinnedPostsStore.getAll(keyRange).onsuccess = e => {
      const pinnedResults = e.target.result
      const res = new Array(pinnedResults.length)
      pinnedResults.forEach((postId, i) => {
        fetchPost(postsStore, sparksStore, bubblesStore, postId, post => {
          res[i] = post
        }, asSpark)
      })
      callback(res)
    }
  })
}
