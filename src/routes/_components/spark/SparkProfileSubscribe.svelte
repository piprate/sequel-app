<script>
  import IconButton from '../IconButton.svelte'
  import { SUBSCRIBE_BUTTON_ANIMATION } from '../../_static/animations'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { setSparkBlocked } from '../../_actions/spark/block'
  import { formatIntl } from '../../_utils/formatIntl'
  import { setSparkSubscribed } from '../../_actions/spark/subscribe'

  export let spark
  export let relationship
  export let ourSpark

  let overrideSubscribed = undefined

  $: sparkId = spark.id
  $: current = ourSpark && sparkId === ourSpark.id
  $: subscribed = (() => {
    if (typeof overrideSubscribed === 'boolean') {
      return overrideSubscribed
    }
    return relationship && relationship.subscribed
  })()
  $: blocked = relationship && relationship.blocked
  $: requestedSubscription = relationship && relationship.requestedSubscription
  $: requested = !subscribed && requestedSubscription
  $: label = (() => {
    if (blocked) {
      return 'intl.unblock'
    }
    return formatIntl('intl.subscribeLabel', { requested })
  })()
  $: pressedLabel = formatIntl('intl.unsubscribeLabel', { requested })
  $: href = (() => {
    if (blocked) {
      return '#fa-unlock'
    } else if (subscribed) {
      return '#fa-user-times'
    } else if (requestedSubscription) {
      return '#fa-hourglass'
    } else {
      return '#fa-user-plus'
    }
  })()
  $: shown = relationship && (!relationship.managed || subscribed || requested)
  $: pressable = !blocked
  $: pressed = !blocked && (subscribed || requestedSubscription)

  let icon

  async function onSubscribeButtonClick (e) {
    e.preventDefault()
    e.stopPropagation()
    if (blocked) { // unblock
      await setSparkBlocked(sparkId, false)
    } else { // subscribe/unsubscribe
      const newSubscribedValue = !(subscribed || requestedSubscription)
      await setSparkSubscribed(sparkId, newSubscribedValue, null, ourSpark.id, false, (val) => {
        overrideSubscribed = val
        if (val) {
          icon.animate(SUBSCRIBE_BUTTON_ANIMATION)
        }
      })
    }
  }
</script>

<div class="spark-profile-subscribe {shown ? 'shown' : ''}">
  <!--
    This button has a few different states.
     - If we're blocking, then it's a normal non-toggle button that unblocks.
     - Otherwise it's a pseudo-toggle button that changes whether we're subscribed to the spark or not.
     - If a subscription is requested, then the button is pressed but shows as "subscription requested" with
       a different icon.
  -->
  <IconButton
          className="spark-profile-subscribe-icon-button"
          {label}
          {pressedLabel}
          {href}
          {pressable}
          {pressed}
          big={!$isVeryTinyMobileSize}
          on:click="{onSubscribeButtonClick}"
          bind:this={icon}
  />
</div>
<style>
  .spark-profile-subscribe {
    grid-area: subscription;
    align-self: flex-start;
    display: none;
  }
  .spark-profile-subscribe.shown {
    display: block;
  }

  @media (max-width: 240px) {
    .spark-profile-subscribe {
      justify-self: flex-end;
    }
  }
</style>