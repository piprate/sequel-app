import { postsCache, sparksCache, setInCache, bubblesCache } from '../cache'

export function sparkSpecificPostId (postId, asSpark) {
  return postId + '\u0000' + asSpark
}

export function cachePost (post, instanceName, asSpark) {
  setInCache(postsCache, instanceName, sparkSpecificPostId(post.id, asSpark), post)
  if (post.authorRef) {
    setInCache(sparksCache, instanceName, post.authorRef.id, post.authorRef)
  }
  if (post.bubbleRef) {
    setInCache(bubblesCache, instanceName, post.bubbleRef.id, post.bubbleRef)
  }
}
