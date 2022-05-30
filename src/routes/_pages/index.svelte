<script>
  import RestrictedPageWarning from '../_components/RestrictedPageWarning.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { currentInstance, isAuthenticated } from '../_store/local'
  import SparkSelectionPage from '../_components/SparkSelectionPage.svelte'
  import BubblesListPage from '../_components/BubblesListPage.svelte'
  import WorldsListPage from '../_components/WorldsListPage.svelte'
  import InfoAside from '../_components/InfoAside.svelte'
  import LoadingPage from '../_components/LoadingPage.svelte'
  import { getBubbleList } from '../_api/bubbles'
  import { accessToken, currentInductionLevel, currentSpark } from '../_store/instance'
  import { getSparkBubbleList, getSparkWorldList } from '../_api/sparks'
  import { unwrap } from '../_utils/mapper'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from 'svelte'

  // suppress warnings
  export let params
  params = undefined

  $: spark = $isAuthenticated && $currentSpark
  $: currentSparkId = spark ? unwrap(spark.id) : ''
  $: showInductionNotice = currentSparkId && $currentInductionLevel <= 1
  $: publicBubblesFetcher = () => getBubbleList($currentInstance, $accessToken)
  $: bubblesFetcher = () => currentSparkId ? getSparkBubbleList($currentInstance, $accessToken, currentSparkId, true) : []
  $: worldsFetcher = () => currentSparkId ? getSparkWorldList($currentInstance, $accessToken, currentSparkId, true) : []

  let loaded = false

  onMount(() => {
    loaded = true
  })
</script>
{#if $isAuthenticated }
  {#if $currentSpark}
    <FreeTextLayout>
      <h1>{formatIntl('intl.homePageGreeting', {spark: $currentSpark.name}) }</h1>
      <h3>{intl.feelingDifferent} <a sapper:prefetch href="/switch">{intl.switchAction}</a>.</h3>
      <a class="button primary profile-button" sapper:prefetch href="/sparks/{currentSparkId}">{intl.profileButton}</a>
      {#if showInductionNotice}
        <div class="induction-notice">
          {intl.inductionLevelOneNotice}
        </div>
      {/if}
      <BubblesListPage {bubblesFetcher} >
        <span slot="header">
           <h2>{intl.yourBubbles}</h2>
        </span>
        <span slot="is-empty">
          <a class="button primary new-entity-button" sapper:prefetch href="/bubbles/new">{intl.createNewBubble}</a>
          <InfoAside className="new-entity-notice-aside">
              {intl.firstBubbleNotice}
          </InfoAside>
        </span>
        <span slot="footer">
          <a class="button primary new-entity-button" sapper:prefetch href="/bubbles/new">{intl.createNewBubble}</a>
        </span>
      </BubblesListPage>
      <WorldsListPage {worldsFetcher} >
        <span slot="header">
           <h2>{intl.yourWorlds}</h2>
        </span>
        <span slot="is-empty">
           <a class="button primary new-entity-button" sapper:prefetch href="/worlds/new">{intl.createNewWorld}</a>
          <InfoAside className="new-entity-notice-aside">
              {intl.firstWorldNotice}
          </InfoAside>
        </span>
        <span slot="footer">
           <a class="button primary new-entity-button" sapper:prefetch href="/worlds/new">{intl.createNewWorld}</a>
        </span>
      </WorldsListPage>
    </FreeTextLayout>
  {:else}
    <SparkSelectionPage/>
  {/if}
{:else if loaded}
  <RestrictedPageWarning showLogo="true" message="{intl.homeDescription}" />
{:else}
  <LoadingPage/>
{/if}

<style>
  .profile-button {
    margin: 10px 10px;
    min-width: 140px;
    display: inline-block;
    text-align: center;
  }
  .new-entity-button {
    margin: 10px 0;
    min-width: 140px;
    display: inline-block;
    text-align: center;
  }
  :global(.new-entity-notice-aside) {
    margin: 10px 10px 0 0;
  }
  .induction-notice {
    margin: 20px 10px 0 10px;
    font-size: 1.2em;
    color: var(--deemphasized-text-color);
    align-items: center;
  }
</style>