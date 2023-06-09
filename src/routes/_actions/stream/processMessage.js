import { mark, stop } from '../../_utils/marks'
import { deletePost } from '../deletePosts'
import { addPostOrNotification } from '../addPostOrNotification'
import { emit } from '../../_utils/eventBus'
import { unwrap } from '../../_utils/mapper'
import { populateNotificationMediaURLs, populatePostMediaURLs } from '../../_api/media'

const KNOWN_EVENTS = ['post_created', 'post_updated', 'post_deleted', 'notification', 'conversation', 'filters_changed']

export function processMessage(instanceName, accessToken, message) {
  console.log('Received message', message)
  const { type, timeline, asSpark, object } = message || {}
  if (!KNOWN_EVENTS.includes(type)) {
    console.warn('ignoring message from server', message)
    return
  }
  mark('processMessage')
  switch (type) {
    case 'post_created':
    case 'post_updated':
      populatePostMediaURLs(object, instanceName, accessToken)
      addPostOrNotification(instanceName, timeline, object, asSpark)
      break
    case 'post_deleted':
      deletePost(instanceName, object, asSpark)
      break
    case 'notification':
      populateNotificationMediaURLs(object, instanceName, accessToken)
      addPostOrNotification(instanceName, timeline, object, asSpark)
      // if (object.type === 'mention') {
      //   addPostOrNotification(instanceName, 'notifications/mentions', object, asSpark)
      // }
      break
    case 'conversation':
      // This is a hack in order to mostly fit the conversation model into
      // a timeline of posts. To have a clean implementation we would need to
      // reproduce what is done for posts for the conversation.
      //
      // It will add new DMs as new conversations instead of updating existing threads
      addPostOrNotification(instanceName, timeline, object.last_status, asSpark)
      break
    case 'filters_changed':
      emit('wordFiltersChanged', instanceName)
      break
  }
  stop('processMessage')
}
