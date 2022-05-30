<script>
  import Post from './Post.svelte'
  import PostHeader from './PostHeader.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { currentInstance, omitEmojiInDisplayNames, underlineLinks } from '../../_store/local'
  import { getSparkAccessibleName } from '../../_a11y/getSparkAccessibleName'
  import { goto } from '@sapper/app'
  import { composeNewPostMentioning } from '../../_actions/mention'
  import { classname } from '../../_utils/classname'
  import { createPostOrNotificationUuid } from '../../_utils/createPostOrNotificationUuid'
  import { formatIntl } from '../../_utils/formatIntl'
  import { currentSpark } from '../../_store/instance'

  export let notification
  export let timelineType
  export let timelineValue
  export let enableShortcuts = null
  export let index
  export let length

  $: actor = notification.actor
  $: actorId = actor && actor.id
  $: notificationId = notification.id
  $: post = notification.subjectPost
  $: postId = post && post.id
  $: uuid = (
          createPostOrNotificationUuid($currentInstance, timelineType, timelineValue, notificationId, postId)
  )
  $: elementId = uuid
  $: shortcutScope = elementId
  $: ariaLabel = (
          !post && formatIntl('intl.newSubscriber', {
            name: getSparkAccessibleName(actor, $omitEmojiInDisplayNames),
            spark: getSparkAccessibleName($currentSpark, $omitEmojiInDisplayNames),
          })
  )
  $: className = (classname(
          'notification-article',
          'shortcut-list-item',
          'focus-fix',
          $underlineLinks && 'underline-links'
  ))

  function openActorProfile () {
    goto(`/sparks/${actorId}`)
  }

  async function mentionActor () {
    await composeNewPostMentioning(actor)
  }
</script>

{#if post}
  <Post {index} {length} {timelineType} {timelineValue}
          {post} {notification} {enableShortcuts} on:recalculateHeight
  />
{:else}
  <article id={elementId}
           class={className}
           tabindex="0"
           aria-posinset={index + 1}
           aria-setsize={length}
           aria-label={ariaLabel}
  >
    <PostHeader {notification} {timelineType}
                author={actor} authorId={actorId} {uuid} isPostInNotification="true" />
    {#if enableShortcuts}
      <Shortcut scope={shortcutScope} key="p" on:pressed="{openActorProfile}" />
      <Shortcut scope={shortcutScope} key="m" on:pressed="{mentionActor}" />
    {/if}
  </article>
{/if}
<style>
  .notification-article {
    padding: var(--post-pad-v) var(--post-pad-h);
    width: 560px;
    max-width: calc(100vw - 40px);
    border-bottom: 1px solid var(--main-border);
  }
  @media (max-width: 767px) {
    .notification-article {
      max-width: calc(100vw - 20px);
      width: 580px;
    }
  }
</style>