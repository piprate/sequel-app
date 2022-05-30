<script>
  import IconButton from '../IconButton.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { currentStatusModifications } from '../../_store/instance'
  import { repliesShown } from '../../_store/local'
  import { registerClickDelegates } from '../../_utils/delegate'
  import { setFavorited } from '../../_actions/favorite'
  import { setReblogged } from '../../_actions/reblog'
  import { importShowStatusOptionsDialog } from '../dialog/asyncDialogs/importShowStatusOptionsDialog.js'
  import { updateProfileAndRelationship } from '../../_actions/accounts'
  import { FAVORITE_ANIMATION, REBLOG_ANIMATION } from '../../_static/animations'
  import { on } from '../../_utils/eventBus'
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let uuid;
  export let isStatusInOwnThread;
  export let replyShown;
  export let enableShortcuts;
  export let shortcutScope;
  export let inReplyToId;
  export let visibility;
  export let originalStatusId;
  export let originalAccountId;
  export let originalStatus;

  let favoriteAnimation = FAVORITE_ANIMATION;
  let reblogAnimation = REBLOG_ANIMATION;

  $: replyLabel = (
          inReplyToId ? 'intl.replyToThread' : 'intl.reply'
  );
  $: replyIcon = inReplyToId ? '#fa-reply-all' : '#fa-reply';
  $: reblogLabel = (() => {
    switch (visibility) {
      case 'private':
        return 'intl.cannotReblogFollowersOnly'
      case 'direct':
        return 'intl.cannotReblogDirectMessage'
      default:
        return 'intl.reblog'
    }
  })();
  $: reblogIcon = (() => {
    switch (visibility) {
      case 'private':
        return '#fa-lock'
      case 'direct':
        return '#fa-envelope'
      default:
        return '#fa-retweet'
    }
  })();
  $: reblogDisabled = (visibility === 'private' || visibility === 'direct');
  $: reblogged = (() => {
    if ($currentStatusModifications && originalStatusId in $currentStatusModifications.reblogs) {
      return $currentStatusModifications.reblogs[originalStatusId]
    }
    return originalStatus.reblogged
  })();
  $: favorited = (() => {
    if ($currentStatusModifications && originalStatusId in $currentStatusModifications.favorites) {
      return $currentStatusModifications.favorites[originalStatusId]
    }
    return originalStatus.favourited
  })();
  $: favoriteKey = `fav-${uuid}`;
  $: reblogKey = `reblog-${uuid}`;
  $: replyKey = `reply-${uuid}`;
  $: optionsKey = `options-${uuid}`;

  let favoriteIconComponent;
  let reblogIconComponent;

  function toggleFavorite() {
    const newFavoritedValue = !favorited
    /* no await */ setFavorited(originalStatusId, newFavoritedValue)
    if (newFavoritedValue) {
      favoriteIconComponent.animate(FAVORITE_ANIMATION)
    }
  }

  function reblog() {
    const newRebloggedValue = !reblogged
    /* no await */ setReblogged(originalStatusId, newRebloggedValue)
    if (newRebloggedValue) {
      reblogIconComponent.animate(REBLOG_ANIMATION)
    }
  }

  function reply() {
    requestAnimationFrame(() => {
      $repliesShown[uuid] = !$repliesShown[uuid];
      dispatch('recalculateHeight');
    })
  }

  async function onOptionsClick() {
    const updateRelationshipPromise = updateProfileAndRelationship(originalAccountId)
    const showStatusOptionsDialog = await importShowStatusOptionsDialog()
    await updateRelationshipPromise
    showStatusOptionsDialog(originalStatus)
  }

  let node;

  function onPostedStatus (realm, inReplyToUuid) {
    if (realm !== originalStatusId ||
            inReplyToUuid !== uuid) {
      return
    }
    try {
      // return status to the reply button after posting a reply
      node.querySelector('.status-toolbar-reply-button').focus({ preventScroll: true })
    } catch (e) { /* ignore */ }
  }

  onMount(() => {
    const removeClickDelegates = registerClickDelegates({
      [favoriteKey]: () => {
        toggleFavorite();
        return true
      },
      [reblogKey]: () => {
        reblog();
        return true
      },
      [replyKey]: () => {
        reply();
        return true
      },
      [optionsKey]: () => {
        onOptionsClick();
        return true
      }
    })
    const removeListener = on('postedStatus', onPostedStatus);

    return () => {
      removeClickDelegates();
      removeListener();
    }
  });
</script>

<div class="status-toolbar {isStatusInOwnThread ? 'status-in-own-thread' : ''}" bind:this={node}>
  <IconButton
    className="status-toolbar-reply-button"
    label={replyLabel}
    pressedLabel="{intl.closeReply}"
    pressable={true}
    pressed={replyShown}
    href={replyIcon}
    clickListener={false}
    elementId={replyKey}
    />
  <IconButton
    label={reblogLabel}
    pressedLabel="Unboost"
    pressable={!reblogDisabled}
    pressed={reblogged}
    disabled={reblogDisabled}
    href={reblogIcon}
    clickListener={false}
    elementId={reblogKey}
    bind:this={reblogIconComponent}
  />
  <IconButton
    label="{intl.favorite}"
    pressedLabel="{intl.unfavorite}"
    pressable={true}
    pressed={favorited}
    href="#fa-star"
    clickListener={false}
    elementId={favoriteKey}
    bind:this={favoriteIconComponent}
    />
  <IconButton
    label="{intl.moreOptions}"
    href="#fa-ellipsis-h"
    clickListener={false}
    elementId={optionsKey}
  />
</div>
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="f" on:pressed="{toggleFavorite}"/>
  <Shortcut scope={shortcutScope} key="r" on:pressed="{reply}"/>
  <Shortcut scope={shortcutScope} key="b" on:pressed="{reblog}"/>
{/if}
<style>
  .status-toolbar {
    grid-area: toolbar;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }
  .status-toolbar.status-in-own-thread {
    margin-left: 63px; /* offset to align all toolbar items: 48px avatar + 15px margin-right */
  }

  @media (max-width: 767px) {
    .status-toolbar.status-in-own-thread {
      margin-left: 53px; /* offset to align all toolbar items: 48px avatar + 5px margin-right */
    }
  }

  @media (max-width: 240px) {
    :global(.status-toolbar .icon-button-svg) {
      width: 20px;
      height: 20px;
    }
  }
</style>
