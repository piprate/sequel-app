<script>
  import SparksListPage from '../../_components/SparksListPage.svelte';
  import SparkBrowserFilter from '../../_components/spark/SparkBrowserFilter.svelte';
  import InfoAside from '../../_components/InfoAside.svelte';
  import RestrictedPageWarning from "../../_components/RestrictedPageWarning.svelte";
  import { currentInstance, isAuthenticated, isUserLoggedIn } from "../../_store/local";
  import { accessToken } from "../../_store/instance";
  import { getSparkList } from "../../_api/sparks";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: sparksFetcher = () => getSparkList($currentInstance, $accessToken);
</script>

{#if $isAuthenticated }
        <SparkBrowserFilter filter="my_stuff" />
        <SparksListPage {sparksFetcher} >
             <span slot="is-empty">
                <a class="button primary new-entity-button" sapper:prefetch href="/bubbles/new">{intl.createNewSpark}</a>
                <InfoAside className="new-entity-notice-aside">
                    {intl.firstSparkNotice}
                </InfoAside>
              </span>
            <span slot="footer">
                <a class="button primary new-entity-button" sapper:prefetch href="/bubbles/new">{intl.createNewSpark}</a>
              </span>
        </SparksListPage>
{:else}
    <RestrictedPageWarning message="{intl.sparksNotLoggedIn}" />
{/if}

<style>
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