import { fetchSpark } from './fetchSpark'
import { BUBBLE_ID, SPARK_ID } from '../constants'
import { fetchBubble } from './fetchBubble'
import { sparkSpecificPostId } from './cachePost'

export function fetchPost(postsStore, sparksStore, bubblesStore, id, callback, asSpark) {
  const dbId = sparkSpecificPostId(id, asSpark)
  postsStore.get(dbId).onsuccess = (e) => {
    const post = e.target.result
    callback(post)
    if (!post) {
      return
    }
    fetchSpark(sparksStore, post[SPARK_ID], (spark) => {
      post.authorRef = spark
    })
    fetchBubble(bubblesStore, post[BUBBLE_ID], (bubble) => {
      post.bubbleRef = bubble
    })
  }
}
