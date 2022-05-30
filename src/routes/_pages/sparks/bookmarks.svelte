<script>
  import SparksListPage from '../../_components/SparksListPage.svelte';
  import InfoAside from '../../_components/InfoAside.svelte';
  import SparkBrowserFilter from '../../_components/spark/SparkBrowserFilter.svelte';
  import { currentInstance, isUserLoggedIn } from "../../_store/local";
  import { accessToken, currentSparkId } from "../../_store/instance";
  import { getBookmarkedSparks } from "../../_api/sparks";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: sparksFetcher = () => $isUserLoggedIn ? getBookmarkedSparks($currentInstance, $accessToken, $currentSparkId) : [];
</script>

{#if $isUserLoggedIn }
    <SparkBrowserFilter filter="bookmarks" />
    <SparksListPage {sparksFetcher} >
        <span slot="is-empty">
            <InfoAside>
                {intl.noSparkBookmarksYet}
            </InfoAside>
        </span>
    </SparksListPage>
{/if}
