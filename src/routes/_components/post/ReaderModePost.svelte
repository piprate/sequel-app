<script>
  import PostContent from './PostContent.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import {
    currentInstance,
    disableLongAriaLabels,
    disableRelativeTimestamps,
    disableTapOnPost,
    now,
    omitEmojiInDisplayNames,
    spoilersShown,
    underlineLinks
  } from '../../_store/local'
  import { goto } from '$app/navigation'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
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
  import PostTimeDate from './PostTimeDate.svelte'
  import PostMediaAttachments from './PostMediaAttachments.svelte'
  import { formatIntl } from '../../_utils/formatIntl'

  export let post
  export let timelineType
  export let timelineValue
  export let index
  export let length
  export let isGroupHead = false

  let preloadHiddenContent = false

  $: postId = post.id
  $: postUnwrappedId = unwrap(postId)
  $: postAuthor = post.authorRef
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
  $: uuid = createPostOrNotificationUuid($currentInstance, timelineType, timelineValue, undefined, postId)
  $: elementId = uuid
  $: shortcutScope = elementId
  $: spoilerShown = !!$spoilersShown[uuid]
  $: showMedia = post.media?.length
  $: postEmojis = post.emojis || []
  $: createdAtDate = post.createdAt
  $: createdAtDateTS = new Date(createdAtDate).getTime()
  $: absoluteFormattedDate = absoluteDateFormatter().format(createdAtDateTS)
  $: shortInlineFormattedDate = $disableRelativeTimestamps
    ? dayOnlyAbsoluteDateFormatter().format(createdAtDateTS)
    : formatTimeagoDate(createdAtDateTS, $now)
  $: ariaLabel = getAccessibleLabelForPost(
    postAuthor,
    plainTextBody,
    shortInlineFormattedDate,
    spoilerText,
    showContent,
    undefined,
    visibility,
    $omitEmojiInDisplayNames,
    $disableLongAriaLabels,
    showMedia
  )
  $: className = classname(
    'post-article',
    'shortcut-list-item',
    'focus-fix',
    visibility === 'subscribers' && 'post-subscribers',
    timelineType !== 'search' && 'post-in-timeline',
    $underlineLinks && 'underline-links',
    !$disableTapOnPost && 'tap-on-post'
  )
  $: content = post.bodyHTML || ''
  $: showContent = !spoilerText || spoilerShown
  $: authorWrote = formatIntl('intl.authorWrote', { author: post.authorRef.name })
  $: wroteInBubble = formatIntl('intl.wroteInBubble', { bubble: post.bubbleRef.name })
  $: authorWroteInBubble = formatIntl('intl.authorWroteInBubble', {
    author: post.authorRef.name,
    bubble: post.bubbleRef.name
  })

  function onClickOrKeydown(e) {
    const { type, keyCode } = e

    const isClick = type === 'click'
    const isEnter = type === 'keydown' && keyCode === 13
    if (!isClick && !isEnter) {
      return false
    }

    open()
    return true
  }

  function open() {
    goto(`/posts/${postUnwrappedId}`)
  }

  function openAuthorProfile() {
    goto(`/sparks/${postAuthor.id}`)
  }

  async function mentionAuthor() {
    await composeNewPostMentioning(postAuthor)
  }

  let article

  onMount(() => {
    let removeClickDelegate
    if (!$disableTapOnPost) {
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
  aria-posinset={index + 1}
  aria-setsize={length}
  aria-label={ariaLabel}
  on:recalculateHeight
  bind:this={article}
>
  {#if isGroupHead}
    <div class="group-head-name">
      {#if timelineType === 'bubble'}
        <p>{authorWrote}</p>
      {:else if timelineType === 'spark'}
        <p>{wroteInBubble}</p>
      {:else}
        <p>{authorWroteInBubble}</p>
      {/if}
    </div>
  {/if}
  <PostTimeDate {uuid} {createdAtDate} {absoluteFormattedDate} />
  <div class="content">
    {#if content && (showContent || preloadHiddenContent)}
      <PostContent {uuid} {post} {postEmojis} shown={showContent} />
    {/if}
    {#if showMedia}
      <PostMediaAttachments enableShortcuts {uuid} {shortcutScope} {post} on:recalculateHeight />
    {/if}
  </div>
</article>
<Shortcut scope={shortcutScope} key="o" on:pressed={open} />
<Shortcut scope={shortcutScope} key="p" on:pressed={openAuthorProfile} />
<Shortcut scope={shortcutScope} key="m" on:pressed={mentionAuthor} />

<style>
  .post-article {
    --post-pad-v: 4px;
    padding: var(--post-pad-v) var(--post-pad-h);
    display: flex;
    flex-direction: column;
  }

  .group-head-name {
    margin: 8px 0 4px 4px;
  }

  .group-head-name p {
    font-size: 1rem;
  }

  .content {
    padding-left: 12px;
  }
</style>
