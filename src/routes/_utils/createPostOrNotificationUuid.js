export function createPostOrNotificationUuid(currentInstance, timelineType, timelineValue, notificationId, postId) {
  return `${currentInstance}/${timelineType}/${timelineValue}/${notificationId || ''}/${postId || ''}`
}
