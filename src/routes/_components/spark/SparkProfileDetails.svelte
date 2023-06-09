<script>
  import IconButton from '../IconButton.svelte'
  import { importShowSparkProfileOptionsDialog } from '../dialog/asyncDialogs/importShowSparkProfileOptionsDialog.js'
  import { LOCALE } from '../../_static/intl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { thunk } from '../../_utils/thunk'
  import { disableSubscriberCounts } from '../../_store/local'
  import { unwrap } from '../../_utils/mapper'

  const numberFormat = thunk(() => new Intl.NumberFormat(LOCALE))

  export let spark
  export let relationship
  export let ourSpark

  $: sparkId = unwrap(spark.id)
  $: numPosts = spark.postCount || 0
  $: numBubbles = spark.bubbleCount || 0
  $: numSubscribers = spark.subscriberCount || 0
  $: numPostsDisplay = numberFormat().format(numPosts)
  $: numBubblesDisplay = numberFormat().format(numBubbles)
  $: numSubscribersDisplay = (() => {
    if ($disableSubscriberCounts && numSubscribers >= 10) {
      return '10+'
    }
    return numberFormat().format(numSubscribers)
  })()
  $: subscribersLabel = formatIntl('intl.subscribersLabel', { count: numSubscribers })
  $: bubblesLabel = formatIntl('intl.bubblesLabel', { count: numBubbles })

  async function onMoreOptionsClick() {
    const showSparkProfileOptionsDialog = await importShowSparkProfileOptionsDialog()
    showSparkProfileOptionsDialog(spark, relationship, ourSpark)
  }
</script>

<h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
<div class="spark-profile-details">
  <div class="spark-profile-details-item">
    <span class="spark-profile-details-item-title">
      {intl.posts}
    </span>
    <span class="spark-profile-details-item-datum">
      {numPostsDisplay}
    </span>
  </div>
  <a
    class="spark-profile-details-item"
    href="/sparks/{sparkId}/subscribers"
    aria-label={subscribersLabel}
    data-sveltekit-preload-data
  >
    <span class="spark-profile-details-item-title">
      {intl.subscribers}
    </span>
    <span class="spark-profile-details-item-datum">
      {numSubscribersDisplay}
    </span>
  </a>
  <a
    class="spark-profile-details-item"
    href="/sparks/{sparkId}/bubbles"
    aria-label={bubblesLabel}
    data-sveltekit-preload-data
  >
    <span class="spark-profile-details-item-title">
      {intl.bubbles}
    </span>
    <span class="spark-profile-details-item-datum">
      {numBubblesDisplay}
    </span>
  </a>
  <div class="spark-profile-more-options">
    <IconButton label={intl.moreOptions} href="#fa-bars" muted="true" on:click={onMoreOptionsClick} />
  </div>
</div>

<style>
  .spark-profile-details {
    grid-area: details;
    display: grid;
    margin: 0 5px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr min-content;
  }

  .spark-profile-details-item {
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    font-size: 1.1em;
  }

  .spark-profile-details-item:hover {
    text-decoration: none;
    background: var(--button-bg-hover);
    cursor: pointer;
  }

  .spark-profile-details-item:active {
    background: var(--button-bg-active);
  }

  .spark-profile-details-item-title {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .spark-profile-details-item-datum {
    color: var(--body-text-color);
    margin-left: 5px;
    font-weight: 600;
  }

  @media (max-width: 767px) {
    .spark-profile-details-item {
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }

    .spark-profile-details-item:last-child {
      margin-right: 0;
    }

    .spark-profile-details-item:first-child {
      margin-left: 0;
    }

    .spark-profile-details-item-title {
      margin-right: 0;
      text-align: center;
    }
    .spark-profile-details-item-datum {
      margin-left: 0;
      text-align: center;
    }
    .spark-profile-details-item {
      font-size: 1em;
    }
  }

  @media (max-width: 240px) {
    .spark-profile-details {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .spark-profile-more-options {
      justify-self: flex-end;
      grid-column: 1 / 4;
    }
  }
</style>
