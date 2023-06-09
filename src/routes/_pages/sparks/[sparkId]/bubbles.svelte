<script>
  import BubblesListPage from '../../../_components/BubblesListPage.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import { currentInstance, isUserLoggedIn, observedSpark } from '../../../_store/local'
  import { accessToken, currentSpark, currentSparkId } from '../../../_store/instance'
  import { getSpark, getSparkBubbleList } from '../../../_api/sparks'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let params

  // suppress warnings
  const intl = {}

  let spark = $observedSpark

  $: sparkName = (spark && spark.name) || ''
  $: self = $currentSparkId && spark && $currentSparkId === spark.id
  $: pageTitle = formatIntl('intl.bubblesFromSpark', { spark: sparkName })
  $: bubblesFetcher = () =>
    $isUserLoggedIn ? getSparkBubbleList($currentInstance, $accessToken, params.sparkId, false) : []

  onMount(async () => {
    if (!spark) {
      spark = await getSpark($currentInstance, $accessToken, params.sparkId)
    }
  })
</script>

<DynamicPageBanner title={pageTitle} icon="#fa-comments" />
{#if $isUserLoggedIn}
  <BubblesListPage {bubblesFetcher}>
    <span slot="is-empty">
      {#if self}
        <div class="new-bubble-button">
          <a class="button primary" data-sveltekit-preload-data href="/bubbles/new">{intl.createNewBubble}</a>
        </div>
      {/if}
    </span>
  </BubblesListPage>
{/if}

<style>
  :global(.new-bubble-button) {
    margin: 25px 0px;
  }
</style>
