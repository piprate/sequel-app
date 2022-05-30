<script>
  import WorldsListPage from '../../_components/WorldsListPage.svelte';
  import WorldBrowserFilter from '../../_components/world/WorldBrowserFilter.svelte';
  import InfoAside from '../../_components/InfoAside.svelte'
  import { currentInstance, isAuthenticated, isUserLoggedIn } from "../../_store/local";
  import { accessToken, currentSpark, currentSparkId, pinnedPage } from "../../_store/instance";
  import DynamicPageBanner from "../../_components/DynamicPageBanner.svelte";
  import HiddenFromSSR from "../../_components/HiddenFromSSR.svelte";
  import FreeTextLayout from "../../_components/FreeTextLayout.svelte";
  import { getSparkWorldList } from "../../_api/sparks";
  import { unwrap } from "../../_utils/mapper";
  import { getWorldList } from "../../_api/worlds";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: myWorldsFetcher = () => $currentSparkId ? getSparkWorldList($currentInstance, $accessToken, unwrap($currentSparkId), true) : [];
  $: allWorldsFetcher = () => $isUserLoggedIn ? getWorldList($currentInstance, $accessToken) : [];
</script>

{#if $isUserLoggedIn }
    {#if $isAuthenticated}
        {#if $pinnedPage !== '/worlds'}
            <DynamicPageBanner title="{intl.worlds}" icon="#fa-globe"/>
        {/if}
        <WorldBrowserFilter filter="my_stuff" />
        <WorldsListPage worldsFetcher={myWorldsFetcher} >
            <span slot="is-empty">
                {#if $currentSpark }
                    <div class="new-world-button">
                        <a class="button primary" sapper:prefetch href="/worlds/new">{intl.createNewWorld}</a>
                    </div>
                   <InfoAside className="new-entity-notice-aside">
                        {intl.worldCreationNotice}
                    </InfoAside>
                {:else if $isAuthenticated }
                    <InfoAside className="select-spark-aside">
                        {intl.selectSparkBeforeCreatingWorld}
                    </InfoAside>
                {/if}
            </span>
        </WorldsListPage>
    {:else}
        <DynamicPageBanner title="{intl.exploreSequelWorlds}" icon="#fa-globe" disableBackButton="true" />
        <div class="notice">
            {intl.visitorWorldsNotice}
        </div>
        <WorldsListPage worldsFetcher={allWorldsFetcher} />
    {/if}
{:else}
    <HiddenFromSSR>
        <FreeTextLayout>
            <h1>{intl.worlds}</h1>

            <p>{intl.worldsNotLoggedIn}</p>
        </FreeTextLayout>
    </HiddenFromSSR>
{/if}

<style>
    .notice {
        margin: 20px 10px 0 10px;
        font-size: 1.1em;
        color: var(--deemphasized-text-color);
        align-items: center;
    }
    :global(.select-spark-aside) {
        margin: 20px 10px 0px 10px;
    }
    :global(.new-world-button) {
        margin: 25px 0px;
    }
    :global(.new-entity-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>