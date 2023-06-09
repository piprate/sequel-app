import { fetchSpark } from './fetchSpark'
import { POST_ID, ACTOR_ID, BUBBLE_ID } from '../constants'
import { fetchPost } from './fetchPost'
import { fetchBubble } from './fetchBubble'

export function fetchNotification(notificationsStore, postsStore, sparksStore, bubblesStore, id, callback, asSpark) {
  notificationsStore.get(id).onsuccess = (e) => {
    const notification = e.target.result
    callback(notification)
    if (!notification) {
      return
    }
    if (notification[ACTOR_ID]) {
      fetchSpark(sparksStore, notification[ACTOR_ID], (spark) => {
        notification.actor = spark
      })
    }
    if (notification[POST_ID]) {
      fetchPost(
        postsStore,
        sparksStore,
        bubblesStore,
        notification[POST_ID],
        (post) => {
          notification.subjectPost = post
        },
        asSpark
      )
    }
    if (notification[BUBBLE_ID]) {
      fetchBubble(
        bubblesStore,
        notification[BUBBLE_ID],
        (bubble) => {
          notification.subjectBubble = bubble
        },
        asSpark
      )
    }
  }
}
