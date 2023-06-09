<script>
  import IconButton from '../IconButton.svelte'
  import { SUBSCRIBE_BUTTON_ANIMATION } from '../../_static/animations'
  import { currentInstance, isVeryTinyMobileSize } from '../../_store/local'
  import { setSparkBlocked } from '../../_actions/spark/block'
  import { formatIntl } from '../../_utils/formatIntl'
  import { setSparkSubscribed } from '../../_actions/spark/subscribe'
  import { setCurrentSpark } from '../../_actions/sparks'

  export let spark
  export let relationship
  export let ourSpark

  $: sparkId = spark.id
  $: current = ourSpark && sparkId === ourSpark.id
  $: subscribed = relationship && relationship.subscribed
  $: requestedSubscription = relationship && relationship.requestedSubscription
  $: requested = !subscribed && requestedSubscription
  $: shown = relationship && relationship.managed && !current && !subscribed && !requested
  $: label = formatIntl('intl.switchToNameOfSpark', { spark: spark.name })

  let pressable = true

  let icon

  async function onSwitchButtonClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSpark($currentInstance, spark)
    icon.animate(SUBSCRIBE_BUTTON_ANIMATION)
  }
</script>

<div class="spark-profile-switch {shown ? 'shown' : ''}">
  <!--
    This button only appears if:
    1) the displayed spark isn't current
    2) the displayed spark is managed by the user
    3) the current spark isn't subscribed to the displayed spark
  -->
  <IconButton
    className="spark-profile-switch-icon-button"
    {label}
    href="#fa-star"
    big={!$isVeryTinyMobileSize}
    on:click={onSwitchButtonClick}
    bind:this={icon}
  />
</div>

<style>
  .spark-profile-switch {
    grid-area: subscription;
    align-self: flex-start;
    display: none;
  }
  .spark-profile-switch.shown {
    display: block;
  }

  @media (max-width: 240px) {
    .spark-profile-switch {
      justify-self: flex-end;
    }
  }
</style>
