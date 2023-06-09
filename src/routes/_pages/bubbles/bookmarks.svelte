<script>
  import BubblesListPage from '../../_components/BubblesListPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import BubbleBrowserFilter from '../../_components/bubble/BubbleBrowserFilter.svelte'
  import { currentInstance, isUserLoggedIn, pinnedPages } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getBookmarkedBubbles } from '../../_api/bubbles'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: bubblesFetcher = () =>
    $isUserLoggedIn ? getBookmarkedBubbles($currentInstance, $accessToken, $currentSparkId) : []
</script>

{#if $isUserLoggedIn}
  {#if $pinnedPages !== '/bubbles'}
    <DynamicPageBanner title={intl.bubbles} icon="#fa-comments" />
  {/if}
  <BubbleBrowserFilter filter="bookmarks" />
  <BubblesListPage {bubblesFetcher}>
    <span slot="is-empty">
      <InfoAside>
        {intl.noBubbleBookmarksYet}
      </InfoAside>
    </span>
  </BubblesListPage>
{/if}
