<script>
  import BubblesListPage from '../../_components/BubblesListPage.svelte'
  import BubbleBrowserFilter from '../../_components/bubble/BubbleBrowserFilter.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isAuthenticated, isUserLoggedIn } from '../../_store/local'
  import { accessToken, currentSparkId, pinnedPage } from '../../_store/instance'
  import { getSparkBubbleList } from '../../_api/sparks'
  import { unwrap } from '../../_utils/mapper'
  import { getBubbleList } from '../../_api/bubbles'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: myBubblesFetcher = () =>
    $currentSparkId ? getSparkBubbleList($currentInstance, $accessToken, unwrap($currentSparkId), true) : []
  $: allBubblesFetcher = () => ($isUserLoggedIn ? getBubbleList($currentInstance, $accessToken) : [])
</script>

{#if $isUserLoggedIn}
  {#if $pinnedPage !== '/bubbles'}
    <DynamicPageBanner title={intl.bubbles} icon="#fa-comments" />
  {/if}
  {#if $isAuthenticated}
    <BubbleBrowserFilter filter="my_stuff" />
    <BubblesListPage bubblesFetcher={myBubblesFetcher}>
      <span slot="is-empty">
        <a class="button primary new-entity-button" data-sveltekit-preload-data href="/bubbles/new"
          >{intl.createNewBubble}</a
        >
        <InfoAside className="new-entity-notice-aside">
          {intl.firstBubbleNotice}
        </InfoAside>
      </span>
      <span slot="footer">
        <a class="button primary new-entity-button" data-sveltekit-preload-data href="/bubbles/new"
          >{intl.createNewBubble}</a
        >
      </span>
    </BubblesListPage>
  {:else}
    <div class="notice">
      {intl.visitorBubblesNotice}
    </div>
    <BubblesListPage bubblesFetcher={allBubblesFetcher} />
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}

<style>
  .notice {
    margin: 20px 10px 0 10px;
    font-size: 1.1em;
    color: var(--deemphasized-text-color);
    align-items: center;
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
</style>
