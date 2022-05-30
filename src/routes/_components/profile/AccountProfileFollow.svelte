<script>
  import IconButton from '../IconButton.svelte'
  import { FOLLOW_BUTTON_ANIMATION } from '../../_static/animations'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { setAccountFollowed } from '../../_actions/follow'
  import { setAccountBlocked } from '../../_actions/block'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  export let account;
  export let relationship;
  export let verifyCredentials;

  let overrideFollowing = undefined;

  $: accountId = account.id;
  $: following = (() => {
    if (typeof overrideFollowing === 'boolean') {
      return overrideFollowing
    }
    return relationship && relationship.following
  })();
  $: blocking = relationship && relationship.blocking;
  $: followRequested = relationship && relationship.requested;
  $: requested = !following && followRequested;
  $: label = (() => {
    if (blocking) {
      return 'intl.unblock'
    }
    return formatIntl('intl.followLabel', { requested })
  })();
  $: pressedLabel = formatIntl('intl.unfollowLabel', { requested });
  $: href = (() => {
    if (blocking) {
      return '#fa-unlock'
    } else if (following) {
      return '#fa-user-times'
    } else if (followRequested) {
      return '#fa-hourglass'
    } else {
      return '#fa-user-plus'
    }
  })();
  $: shown = verifyCredentials && relationship && verifyCredentials.id !== relationship.id;
  $: pressable = !blocking;
  $: pressed = !blocking && (following || followRequested);

  let icon;

  async function onFollowButtonClick (e) {
    e.preventDefault()
    e.stopPropagation()
    if (blocking) { // unblock
      await setAccountBlocked(accountId, false)
    } else { // follow/unfollow
      const newFollowingValue = !(following || followRequested)
      if (!account.locked) { // be optimistic, show the user that it succeeded
        overrideFollowing = newFollowingValue;
      }
      if (newFollowingValue) {
        icon.animate(FOLLOW_BUTTON_ANIMATION)
      }
      await setAccountFollowed(accountId, newFollowingValue)
    }
  }
</script>

<div class="account-profile-follow {shown ? 'shown' : ''}">
  <!--
    This button has a few different states.
     - If we're blocking, then it's a normal non-toggle button that unblocks.
     - Otherwise it's a pseudo-toggle button that changes whether we're following the account or not.
     - If a follow is requested, then the button is pressed but shows as "follow requested" with
       a different icon.
  -->
  <IconButton
          className="account-profile-follow-icon-button"
          {label}
          {pressedLabel}
          {href}
          {pressable}
          {pressed}
          big={!$isVeryTinyMobileSize}
          on:click="{onFollowButtonClick}"
          bind:this={icon}
  />
</div>
<style>
  .account-profile-follow {
    grid-area: follow;
    align-self: flex-start;
    display: none;
  }
  .account-profile-follow.shown {
    display: block;
  }

  @media (max-width: 240px) {
    .account-profile-follow {
      justify-self: flex-end;
    }
  }
</style>