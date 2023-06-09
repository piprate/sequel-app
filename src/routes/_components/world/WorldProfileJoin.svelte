<script>
  import IconButton from '../IconButton.svelte'
  import { SUBSCRIBE_BUTTON_ANIMATION } from '../../_static/animations'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { updateMembership } from '../../_actions/world/membership'
  import { setWorldBlocked } from '../../_actions/world/block'
  import { formatIntl } from '../../_utils/formatIntl'

  export let world
  export let relationship
  export let ourSpark

  let overrideJoined = undefined

  $: worldId = world.id
  $: joined = (() => {
    if (typeof overrideJoined === 'boolean') {
      return overrideJoined
    }
    return relationship && relationship.joined
  })()
  $: blocked = relationship && relationship.blocked
  $: requestedMembership = relationship && relationship.requestedMembership
  $: requested = !joined && requestedMembership
  $: label = (() => {
    if (blocked) {
      return 'intl.unblock'
    }
    return formatIntl('intl.joinWorldLabel', { requested })
  })()
  $: pressedLabel = formatIntl('intl.leaveWorldLabel', { requested })
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
  $: shown = ourSpark && relationship && ourSpark.id !== relationship.id
  $: pressable = !blocked
  $: pressed = !blocked && (joined || requestedMembership)

  let icon

  async function onJoinButtonClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (blocked) {
      // unblock
      await setWorldBlocked(worldId, false, ourSpark.id)
    } else {
      // join/leave
      const newJoinedValue = !(joined || requestedMembership)

      // be optimistic, show the user that it succeeded
      overrideJoined = newJoinedValue

      if (newJoinedValue) {
        icon.animate(SUBSCRIBE_BUTTON_ANIMATION)
      }
      await updateMembership(worldId, newJoinedValue, ourSpark.id, true)
    }
  }
</script>

<div class="world-profile-join {shown ? 'shown' : ''}">
  <!--
    This button has a few different states.
     - If we're blocking, then it's a normal non-toggle button that unblocks.
     - Otherwise it's a pseudo-toggle button that changes whether we're joined the world or not.
     - If a subscription is requested, then the button is pressed but shows as "subscription requested" with
       a different icon.
  -->
  <IconButton
    className="world-profile-join-icon-button"
    {label}
    {pressedLabel}
    {href}
    {pressable}
    {pressed}
    big={!$isVeryTinyMobileSize}
    on:click={onJoinButtonClick}
    bind:this={icon}
  />
</div>

<style>
  .world-profile-join {
    grid-area: membership;
    align-self: flex-start;
    display: none;
  }
  .world-profile-join.shown {
    display: block;
  }

  @media (max-width: 240px) {
    .world-profile-join {
      justify-self: flex-end;
    }
  }
</style>
