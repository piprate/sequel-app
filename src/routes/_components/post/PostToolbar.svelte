<script>
  import IconButton from '../IconButton.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { currentSpark, currentSparkId } from '../../_store/instance'
  import { currentPostModifications } from '../../_store/store'
  import { repliesShown } from '../../_store/local'
  import { registerClickDelegates } from '../../_utils/delegate'
  import { setTMM } from '../../_actions/tellMeMore'
  import { importShowPostOptionsDialog } from '../dialog/asyncDialogs/importShowPostOptionsDialog.js'
  import { updateProfileAndRelationship } from '../../_actions/sparks'
  import { BOOKMARK_ANIMATION, TMM_ANIMATION } from '../../_static/animations'
  import { on } from '../../_utils/eventBus'
  import { createEventDispatcher, onMount } from 'svelte'
  import { unwrap } from '../../_utils/mapper'
  import { setPostBookmarked } from '../../_actions/bookmark'
  import { canPost } from '../../_actions/compose'

  const dispatch = createEventDispatcher()

  export let uuid
  export let isPostInOwnThread
  export let replyShown
  export let enableShortcuts
  export let shortcutScope
  export let inReplyToId
  export let postId
  export let postAuthorId
  export let post

  let canComment = false

  $: sparkNotSelected = !($currentSpark)
  $: replyLabel = (
          inReplyToId ? 'intl.replyToThread' : 'intl.reply'
  )
  $: replyIcon = inReplyToId ? '#fa-reply-all' : '#fa-reply'
  $: tellMeMored = (() => {
    if ($currentPostModifications && postId in $currentPostModifications.tellMeMores) {
      return $currentPostModifications.tellMeMores[postId]
    }
    return post.ttm
  })()
  $: bookmarked = (() => {
    if ($currentPostModifications && postId in $currentPostModifications.bookmarks) {
      return $currentPostModifications.bookmarks[postId]
    }
    return post.bookmarked
  })()
  $: bookmarkKey = `bm-${uuid}`
  $: tmmKey = `tmm-${uuid}`
  $: replyKey = `reply-${uuid}`
  $: optionsKey = `options-${uuid}`
  $: commentCount = post.replyCount || 0
  $: commentCountDigits = Math.min(3, commentCount.toString().length)
  $: commentCountToShow = (commentCount < 100 ? commentCount.toString() : '99+')
  $: replyDisabled = !canComment

  let bookmarkIconComponent
  let tmmIconComponent

  function toggleBookmark () {
    const newBookmarkValue = !bookmarked
    /* no await */
    setPostBookmarked(postId, newBookmarkValue, $currentSparkId)
    if (newBookmarkValue) {
      bookmarkIconComponent.animate(BOOKMARK_ANIMATION)
    }
  }

  function tellMeMore () {
    const newTMMValue = !tellMeMored
    /* no await */
    setTMM(postId, newTMMValue)
    if (newTMMValue) {
      tmmIconComponent.animate(TMM_ANIMATION)
    }
  }

  function reply () {
    requestAnimationFrame(() => {
      $repliesShown[uuid] = !$repliesShown[uuid]
      dispatch('recalculateHeight')
    })
  }

  async function onOptionsClick () {
    const updateRelationshipPromise = updateProfileAndRelationship(unwrap(postAuthorId))
    const showPostOptionsDialog = await importShowPostOptionsDialog()
    await updateRelationshipPromise
    showPostOptionsDialog(post)
  }

  let node

  function onPublishedPost (realm, inReplyToUuid) {
    if (realm !== postId || inReplyToUuid !== uuid) {
      return
    }
    try {
      // return post to the reply button after posting a reply
      node.querySelector('.post-toolbar-reply-button').focus({ preventScroll: true })
    } catch (e) { /* ignore */ }
  }

  onMount(() => {
    const removeClickDelegates = registerClickDelegates({
      [bookmarkKey]: () => {
        toggleBookmark()
        return true
      },
      [tmmKey]: () => {
        tellMeMore()
        return true
      },
      [replyKey]: () => {
        reply()
        return true
      },
      [optionsKey]: () => {
        if (!sparkNotSelected) {
          onOptionsClick()
        }
        return true
      }
    })
    const removeListener = on('publishedPost', onPublishedPost)

    canPost(post.bubble, $currentSparkId, true).then(val => canComment = val)

    return () => {
      removeClickDelegates()
      removeListener()
    }
  })
</script>

<div class="post-toolbar {isPostInOwnThread ? 'post-in-own-thread' : ''}" bind:this={node}>
  <div class="reply-button-wrapper">
    <IconButton
            className="post-toolbar-reply-button"
            label={replyLabel}
            pressedLabel="{intl.closeReply}"
            pressable={true}
            pressed={replyShown}
            disabled={replyDisabled}
            href={replyIcon}
            clickListener={false}
            elementId={replyKey}
    />
    {#if commentCount}
      <span class="comment-count comment-count-digits-{commentCountDigits}" aria-hidden="true">
        {commentCountToShow}
      </span>
    {/if}
  </div>
  <IconButton
    label="{intl.tellMeMore}"
    pressedLabel="{intl.unTellMeMore}"
    pressable={!sparkNotSelected}
    pressed={tellMeMored}
    disabled={sparkNotSelected}
    href="#fa-fire"
    clickListener={false}
    elementId={tmmKey}
    bind:this={tmmIconComponent}
  />
  <IconButton
    label="{intl.bookmarkPost}"
    pressedLabel="{intl.unbookmarkPost}"
    pressable={true}
    pressed={bookmarked}
    disabled={sparkNotSelected}
    href="#fa-bookmark"
    clickListener={false}
    elementId={bookmarkKey}
    bind:this={bookmarkIconComponent}
    />
  <IconButton
    label="{intl.moreOptions}"
    href="#fa-ellipsis-h"
    disabled={sparkNotSelected}
    clickListener={false}
    elementId={optionsKey}
  />
</div>
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="b" on:pressed="{toggleBookmark}"/>
  <Shortcut scope={shortcutScope} key="r" on:pressed="{reply}"/>
  <Shortcut scope={shortcutScope} key="t" on:pressed="{tellMeMore}"/>
{/if}
<style>
  .post-toolbar {
    grid-area: toolbar;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }
  .post-toolbar.post-in-own-thread {
    margin-left: 63px; /* offset to align all toolbar items: 48px avatar + 15px margin-right */
  }

  .reply-button-wrapper {
    position: relative;
    display: inline-block;
  }

  .comment-count {
    position: absolute;
    display: block;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translate(10px, 7px);
    z-index: 10;
    color: var(--action-button-fill-color);
    font-size: 0.8em;
    margin: 10px 30px;
    font-weight: 600;
  }

  .comment-count-digits-2 {
    font-size: 0.7em;
  }

  .comment-count-digits-3 {
    font-size: 0.6em;
  }

  @media (max-width: 767px) {
    .post-toolbar.post-in-own-thread {
      margin-left: 53px; /* offset to align all toolbar items: 48px avatar + 5px margin-right */
    }
  }

  @media (max-width: 240px) {
    :global(.post-toolbar .icon-button-svg) {
      width: 20px;
      height: 20px;
    }
  }
</style>
