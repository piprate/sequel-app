<script>
  import PostSidebar from './PostSidebar.svelte'
  import PostHeader from './PostHeader.svelte'
  import PostAuthorName from './PostAuthorName.svelte'
  import PostRelativeDate from './PostRelativeDate.svelte'
  import PostDetails from './PostDetails.svelte'
  import PostToolbar from './PostToolbar.svelte'
  import PostMediaAttachments from './PostMediaAttachments.svelte'
  import PostContent from './PostContent.svelte'
  import PostSpoiler from './PostSpoiler.svelte'
  import PostComposeBox from './PostComposeBox.svelte'
  import PostLocation from './PostLocation.svelte'
  import PostMentions from './PostMentions.svelte'
  import PostPoll from './PostPoll.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import {
    currentInstance,
    disableLongAriaLabels,
    disableRelativeTimestamps,
    disableTapOnPost,
    isAuthenticated,
    now,
    omitEmojiInDisplayNames,
    repliesShown,
    spoilersShown,
    underlineLinks
  } from '../../_store/local'
  import { goto } from '$app/navigation'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { classname } from '../../_utils/classname'
  import { checkDomAncestors } from '../../_utils/checkDomAncestors'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { getSparkAccessibleName } from '../../_a11y/getSparkAccessibleName'
  import { getAccessibleLabelForPost } from '../../_a11y/getAccessibleLabelForPost'
  import { formatTimeagoDate } from '../../_intl/formatTimeagoDate'
  import { measureText } from '../../_utils/measureText'
  import { LONG_POST_LENGTH, LONG_POST_TEXT } from '../../_static/posts'
  import { absoluteDateFormatter, dayOnlyAbsoluteDateFormatter } from '../../_utils/formatters'
  import { composeNewPostMentioning } from '../../_actions/mention'
  import { createPostOrNotificationUuid } from '../../_utils/createPostOrNotificationUuid'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { onMount } from 'svelte'
  import { unwrap } from '../../_utils/mapper'

  const INPUT_TAGS = new Set(['a', 'button', 'input', 'textarea', 'label'])
  const isUserInputElement = (node) => INPUT_TAGS.has(node.localName)
  const isToolbar = (node) => node.classList.contains('post-toolbar')
  const isPostArticle = (node) => node.classList.contains('post-article')

  export let post
  export let timelineType
  export let timelineValue
  export let index
  export let length
  export let notification = undefined
  export let enableShortcuts = null

  let replyVisibility = undefined
  let preloadHiddenContent = false

  $: postId = post.id
  $: bubbleId = unwrap(post.bubble)
  $: postUnwrappedId = unwrap(postId)
  $: notificationId = notification && notification.id
  $: author = (notification && notification.actor) || post.authorRef
  $: authorId = author.id
  $: postAuthor = post.authorRef
  $: postAuthorId = postAuthor.id
  $: sparkForShortcut = notification ? notification.actor : postAuthor
  $: visibility = post.visibility
  $: plainTextBody = post.bodyText || ''
  $: plainTextBodyOverLength =
    // measureText() is expensive, so avoid doing it when possible.
    // Also measureText() typically only makes text shorter, not longer, so we can measure the raw length
    // as a shortcut. (The only case where it makes text longer is with short URLs which get expanded to a longer
    // placeholder.) This isn't 100% accurate, but we don't need perfect accuracy here because this is just
    // to show a "long post" content warning.
    plainTextBody.length > LONG_POST_LENGTH && measureText(plainTextBody) > LONG_POST_LENGTH
  $: spoilerText = post.spoiler_text || (plainTextBodyOverLength && LONG_POST_TEXT)
  $: inReplyToId = post.inReplyTo
  $: uuid = createPostOrNotificationUuid($currentInstance, timelineType, timelineValue, notificationId, postId)
  $: elementId = uuid
  $: shortcutScope = elementId
  $: isPostInOwnThread = (timelineType === 'post' || timelineType === 'reply') && timelineValue === postUnwrappedId
  $: isPostInNotification =
    notification &&
    notification.subjectPost &&
    notification.type !== 'mention' &&
    notification.subjectPost.id === postId
  $: showLocation = timelineType === 'world' || timelineType === 'spark' || timelineType === 'notifications'
  $: spoilerShown = !!$spoilersShown[uuid]
  $: replyShown = !!$repliesShown[uuid]
  $: showPoll = post.poll
  $: showMedia = !isPostInNotification && post.media && post.media.length
  $: postAuthorEmojis = postAuthor.emojis || []
  $: postEmojis = post.emojis || []
  $: postAuthorAccessibleName = (() => {
    return getSparkAccessibleName(postAuthor, $omitEmojiInDisplayNames)
  })()
  $: createdAtDate = post.createdAt
  $: createdAtDateTS = new Date(createdAtDate).getTime()
  $: updatedAtDate = post.lastUpdatedAt
  $: updatedAtDateTS = new Date(updatedAtDate).getTime()
  $: absoluteFormattedCreatedAtDate = absoluteDateFormatter().format(createdAtDateTS)
  $: absoluteFormattedUpdatedAtDate = absoluteDateFormatter().format(updatedAtDateTS)
  $: shortInlineFormattedDate = $disableRelativeTimestamps
    ? dayOnlyAbsoluteDateFormatter().format(createdAtDateTS)
    : formatTimeagoDate(createdAtDateTS, $now)
  $: ariaLabel = getAccessibleLabelForPost(
    postAuthor,
    plainTextBody,
    shortInlineFormattedDate,
    spoilerText,
    showContent,
    notification,
    visibility,
    $omitEmojiInDisplayNames,
    $disableLongAriaLabels,
    showMedia,
    showPoll
  )
  $: showHeader =
    (notification && ['tmm', 'mention', 'comment'].includes(notification.type)) || timelineType === 'pinned'
  $: className = classname(
    'post-article',
    'shortcut-list-item',
    'focus-fix',
    visibility === 'subscribers' && 'post-subscribers',
    timelineType !== 'search' && 'post-in-timeline',
    isPostInOwnThread && 'post-in-own-thread',
    $underlineLinks && 'underline-links',
    !$disableTapOnPost && !isPostInOwnThread && 'tap-on-post'
  )
  $: content = post.bodyHTML || ''
  $: showContent = !spoilerText || spoilerShown

  function onClickOrKeydown(e) {
    const { type, keyCode, target } = e

    const isClick = type === 'click'
    const isEnter = type === 'keydown' && keyCode === 13
    if (!isClick && !isEnter) {
      return false
    }
    if (checkDomAncestors(target, isUserInputElement, isPostArticle)) {
      // this element or any ancestors up to the post-article element is
      // a user input element
      return false
    }
    if (checkDomAncestors(target, isToolbar, isPostArticle)) {
      // this element or any of its ancestors is the toolbar
      return false
    }

    open()
    return true
  }

  function open() {
    goto(`/posts/${postUnwrappedId}`)
  }

  function openAuthorProfile() {
    goto(`/sparks/${sparkForShortcut.id}`)
  }

  async function mentionAuthor() {
    await composeNewPostMentioning(sparkForShortcut)
  }

  let article

  onMount(() => {
    let removeClickDelegate
    if (!isPostInOwnThread && !$disableTapOnPost) {
      // the whole <article> is clickable in this case
      removeClickDelegate = registerClickDelegate(elementId, (e) => onClickOrKeydown(e))
    }
    if (!showContent) {
      scheduleIdleTask(() => {
        // Perf optimization: lazily load the PostContent when the user is idle so that
        // it's fast when they click the "show more" button
        preloadHiddenContent = true
      })
    }
    scheduleIdleTask(() => addEmojiTooltips(article))

    return () => {
      if (removeClickDelegate) {
        removeClickDelegate()
      }
    }
  })
</script>

<article
  id={elementId}
  class={className}
  tabindex="0"
  aria-posinset={index + 1}
  aria-setsize={length}
  aria-label={ariaLabel}
  on:recalculateHeight
  bind:this={article}
>
  {#if showHeader}
    <PostHeader {author} {authorId} {uuid} {isPostInNotification} {notification} {timelineType} />
  {/if}
  <PostAuthorName {uuid} {isPostInNotification} {isPostInOwnThread} {postAuthor} {postAuthorId} />
  {#if !isPostInOwnThread}
    <PostRelativeDate
      {uuid}
      {postId}
      {isPostInNotification}
      {createdAtDate}
      {shortInlineFormattedDate}
      absoluteFormattedDate={absoluteFormattedCreatedAtDate}
    />
  {/if}
  <PostSidebar {uuid} {isPostInOwnThread} {postAuthor} {postAuthorId} />
  {#if spoilerText}
    <PostSpoiler
      {uuid}
      {isPostInNotification}
      {isPostInOwnThread}
      {spoilerShown}
      {enableShortcuts}
      {shortcutScope}
      {spoilerText}
      {postEmojis}
      on:recalculateHeight
    />
  {/if}
  {#if content && (showContent || preloadHiddenContent)}
    <PostContent {uuid} {post} {isPostInOwnThread} {isPostInNotification} {postEmojis} shown={showContent} />
    {#if post.mentions}
      <PostMentions {post} />
    {/if}
  {/if}
  {#if showMedia}
    <PostMediaAttachments {uuid} {enableShortcuts} {shortcutScope} {post} on:recalculateHeight />
  {/if}
  {#if showPoll && (showContent || preloadHiddenContent)}
    <PostPoll
      {notification}
      {uuid}
      {isPostInNotification}
      {isPostInOwnThread}
      {post}
      {postEmojis}
      shown={showContent}
    />
  {/if}
  {#if showLocation}
    <PostLocation bubble={post.bubbleRef} />
  {/if}
  {#if isPostInOwnThread}
    <PostDetails
      {post}
      {createdAtDate}
      {createdAtDateTS}
      {updatedAtDate}
      {updatedAtDateTS}
      {absoluteFormattedCreatedAtDate}
      {absoluteFormattedUpdatedAtDate}
    />
  {/if}
  {#if $isAuthenticated}
    <PostToolbar
      {uuid}
      {isPostInOwnThread}
      {enableShortcuts}
      {shortcutScope}
      {inReplyToId}
      {postId}
      {post}
      {postAuthorId}
      {replyShown}
      on:recalculateHeight
    />
  {/if}
  {#if replyShown}
    <PostComposeBox {uuid} {visibility} originalPostId={postId} {bubbleId} {spoilerText} on:recalculateHeight />
  {/if}
</article>
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="o" on:pressed={open} />
  <Shortcut scope={shortcutScope} key="p" on:pressed={openAuthorProfile} />
  <Shortcut scope={shortcutScope} key="m" on:pressed={mentionAuthor} />
{/if}

<style>
  .post-article {
    padding: var(--post-pad-v) var(--post-pad-h);
    display: grid;
    grid-template-areas:
      'header  header       header        header'
      'sidebar author-name  author-handle relative-date'
      'sidebar spoiler      spoiler       spoiler'
      'sidebar spoiler-btn  spoiler-btn   spoiler-btn'
      'sidebar content      content       content'
      'sidebar mentions     mentions      mentions'
      'sidebar card         card          card'
      'sidebar media-grp    media-grp     media-grp'
      'sidebar poll         poll          poll'
      'media   media        media         media'
      '....... location     location      location'
      '....... toolbar      toolbar       toolbar'
      'compose compose      compose       compose';
    grid-template-columns: min-content minmax(0, max-content) 1fr min-content;
    grid-template-rows: repeat(8, max-content);
  }

  .post-article.tap-on-post {
    cursor: pointer;
  }

  .post-article.post-in-timeline {
    border-bottom: 1px solid var(--main-border);
  }

  .post-article.post-subscribers {
    background-color: var(--post-subscribers-background);
  }

  .post-article.post-in-own-thread {
    grid-template-areas:
      'sidebar     author-name'
      'sidebar     author-handle'
      'spoiler     spoiler'
      'spoiler-btn spoiler-btn'
      'content     content'
      'mentions    mentions'
      'card        card'
      'media-grp   media-grp'
      'media       media'
      'poll        poll'
      'location    location'
      'details     details'
      'toolbar     toolbar'
      'compose     compose';
    grid-template-columns: min-content 1fr;
    grid-template-rows: repeat(7, max-content);
  }

  .edited {
  }
</style>
