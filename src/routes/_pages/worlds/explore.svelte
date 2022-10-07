<script>
  import WorldsListPage from '../../_components/WorldsListPage.svelte'
  import WorldBrowserFilter from '../../_components/world/WorldBrowserFilter.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import { currentInstance, isUserLoggedIn, pinnedPages } from '../../_store/local'
  import { accessToken } from '../../_store/instance'
  import { getWorldList } from '../../_api/worlds'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: worldsFetcher = () => $isUserLoggedIn ? getWorldList($currentInstance, $accessToken) : []
</script>

{#if $isUserLoggedIn }
    {#if $pinnedPages !== '/worlds'}
        <DynamicPageBanner title="{intl.worlds}" icon="#fa-globe"/>
    {/if}
    <WorldBrowserFilter filter="explore" />
    <WorldsListPage {worldsFetcher} />
{/if}
