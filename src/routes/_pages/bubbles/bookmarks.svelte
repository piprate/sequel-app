<script>
  import BubblesListPage from '../../_components/BubblesListPage.svelte';
  import InfoAside from '../../_components/InfoAside.svelte';
  import BubbleBrowserFilter from '../../_components/bubble/BubbleBrowserFilter.svelte';
  import { currentInstance, isUserLoggedIn } from "../../_store/local";
  import { accessToken, currentSparkId } from "../../_store/instance";
  import { getBookmarkedBubbles } from "../../_api/bubbles";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: bubblesFetcher = () => $isUserLoggedIn ? getBookmarkedBubbles($currentInstance, $accessToken, $currentSparkId) : [];
</script>

{#if $isUserLoggedIn }
    <BubbleBrowserFilter filter="bookmarks" />
    <BubblesListPage {bubblesFetcher} >
        <span slot="is-empty">
            <InfoAside>
                {intl.noBubbleBookmarksYet}
            </InfoAside>
        </span>
    </BubblesListPage>
{/if}
