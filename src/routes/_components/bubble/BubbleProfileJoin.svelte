<script>
  import IconButton from '../IconButton.svelte'
  import { SUBSCRIBE_BUTTON_ANIMATION } from '../../_static/animations'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { setBubbleBlocked } from '../../_actions/bubble/block'
  import { formatIntl } from '../../_utils/formatIntl'
  import LoadingSpinner from '../LoadingSpinner.svelte'

  export let bubble
  export let relationship
  export let ourSpark
  export let loading
  export let joined
  export let onJoinButtonClick

  $: bubbleId = bubble.id
  $: owned = relationship && relationship.memberType === 'owner'
  $: blocked = relationship && relationship.blocked
  $: requestedMembership = relationship && relationship.status === 'pending'
  $: requested = !joined && requestedMembership
  $: label = (() => {
    if (blocked) {
      return 'intl.unblock'
    }
    return formatIntl('intl.joinBubbleLabel', { requested })
  })()
  $: pressedLabel = formatIntl('intl.leaveBubbleLabel', { requested })
  $: href = (() => {
    if (blocked) {
      return '#fa-unlock'
    } else if (joined) {
      return '#fa-sign-out'
    } else if (requestedMembership) {
      return '#fa-hourglass'
    } else {
      return '#fa-sign-in'
    }
  })()
  $: shown =
    !owned &&
    ourSpark &&
    relationship &&
    ourSpark.id !== relationship.owner &&
    (blocked || joined || requestedMembership || bubble.membershipMode !== 'invite_only')
  $: pressable = !blocked
  $: pressed = !blocked && (joined || requestedMembership)

  let icon

  async function onClick(e) {
    e.preventDefault()
    e.stopPropagation()

    if (blocked) {
      // unblock
      await setBubbleBlocked(bubbleId, false, ourSpark.id)
    } else {
      // join/leave
      const newJoinedValue = !(joined || requestedMembership)

      if (newJoinedValue) {
        icon.animate(SUBSCRIBE_BUTTON_ANIMATION)
      }
      await onJoinButtonClick(e, newJoinedValue, true)
    }
  }
</script>

<div class="bubble-profile-join {shown ? 'shown' : ''}">
  <!--
    This button has a few different states.
     - If we're blocking, then it's a normal non-toggle button that unblocks.
     - Otherwise it's a pseudo-toggle button that changes whether we're joined the bubble or not.
     - If a subscription is requested, then the button is pressed but shows as "subscription requested" with
       a different icon.
  -->
  <div class="quick-action">
    {#if loading}
      <LoadingSpinner size={20} />
    {/if}
    <IconButton
      className="bubble-profile-join-icon-button"
      {label}
      {pressedLabel}
      {href}
      {pressable}
      {pressed}
      disabled={loading}
      big={!$isVeryTinyMobileSize}
      on:click={onClick}
      bind:this={icon}
    />
  </div>
</div>

<style>
  .bubble-profile-join {
    grid-area: membership;
    align-self: flex-start;
    display: none;
    position: relative;
  }

  .quick-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .bubble-profile-join.shown {
    display: block;
  }

  @media (max-width: 240px) {
    .bubble-profile-join {
      justify-self: flex-end;
    }
  }
</style>
