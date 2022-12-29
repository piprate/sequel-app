<script>
  import Avatar from '../Avatar.svelte'
  import SparkDisplayName from '../spark/SparkDisplayName.svelte'
  import SvgIcon from '../SvgIcon.svelte'
  import BubbleDisplayName from '../bubble/BubbleDisplayName.svelte'
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { unwrap } from '../../_utils/mapper'
  import { notificationActionText, notificationIcon } from '../../_static/notifications'

  export let author
  export let authorId
  export let uuid
  export let isPostInNotification
  export let notification
  export let timelineType

  $: elementId = `post-header-${uuid}`
  $: elementSubjectId = `post-header-subject-${uuid}`
  $: notificationType = notification && notification.type
  $: icon = timelineType === 'pinned' ? '#fa-thumb-tack' : notificationIcon(notificationType)
  $: actionText = notificationActionText(notificationType)
  $: standaloneHeader = notificationType !== 'tmm'
</script>

<div class="post-header {isPostInNotification ? 'post-in-notification' : ''} {standaloneHeader ? 'standalone-header' : ''}">
  <div class="post-header-avatar {timelineType === 'pinned' || notificationType === 'comment' ? 'hidden' : ''}">
    <Avatar entity={author} size="extra-small"/>
  </div>
  <SvgIcon className="post-header-svg" href={icon} />

  <div class="post-header-content">
    {#if timelineType === 'pinned'}
      <span class="post-header-author">
        {intl.pinnedPost}
      </span>
    {:else}
      {#if notificationType !== 'comment'}
      <a id={elementId}
         href="/sparks/{unwrap(authorId)}"
         data-sveltekit-preload-data
         class="post-header-author"
      >
        <SparkDisplayName spark={author} />
      </a>
      {/if}
      <span class="post-header-action">{actionText}</span>
      {#if notificationType === 'join_bubble' || notificationType === 'leave_bubble' }
        <a id={elementSubjectId}
           href="/bubbles/{unwrap(notification.subjectBubble.id)}"
           data-sveltekit-preload-data
           class="post-header-author"
        >
          <BubbleDisplayName bubble={notification.subjectBubble} />
        </a>
        <span class="post-header-action">{intl.bubbleSuffix}</span>
      {/if}
      {#if notificationType === 'mod_offer'}
        <a id={elementSubjectId}
           href="/marketplace/{notification.subjectListing.id}"
           data-sveltekit-preload-data
           class="post-header-author"
        >
          <EntityDisplayName entity={notification.subjectListing.object} />
        </a>
        <span class="post-header-action">{intl.offeredSuffix}</span>
      {/if}
    {/if}
  </div>
</div>
<style>
  .post-header {
    grid-area: header;
    margin: 0 10px 5px 5px;
    display: flex;
    align-items: center;
  }
  .post-header.standalone-header {
    margin-bottom: 0; /* standalone, so doesn't need a bottom margin */
  }

  .post-header-avatar {
    margin-left: 19px; /* offset for avatar, 48px - 24px - 5px */
  }

  :global(.post-header-svg) {
    min-width: 18px;
    margin-left: 20px;
    width: 18px;
    height: 18px;
    fill: var(--deemphasized-text-color);
  }

  :global(.post-header.post-in-notification .post-header-svg) {
    fill: var(--body-text-color);
  }

  .post-header-content {
    display: flex;
    flex: 1;
    min-width: 0;
    width: 0;
  }

  .post-header-author {
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .post-header-action {
    margin-left: 0.5ch;
    white-space: nowrap;
  }

  .post-header-action,
  .post-header-author,
  .post-header-author:visited,
  .post-header-author:hover {
    color: var(--deemphasized-text-color);
  }

  .post-in-notification .post-header-action,
  .post-in-notification .post-header-author,
  .post-in-notification .post-header-author:visited,
  .post-in-notification .post-header-author:hover {
    color: var(--body-text-color);
  }

  @media (max-width: 767px) {
    :global(.post-header-svg) {
      margin-left: 10px;
    }
  }

  @media (max-width: 240px) {
    .post-header {
      margin-left: 0;
    }
    .post-header-avatar {
      margin-left: 0;
    }
  }
</style>
