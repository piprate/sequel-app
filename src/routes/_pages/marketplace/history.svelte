<script>
  import ListingsPage from '../../_components/marketplace/ListingsPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isUserLoggedIn } from '../../_store/local'
  import { accessToken, currentSparkId, pinnedPage } from '../../_store/instance'
  import { getMarketplaceHistory } from '../../_api/marketplace'
  import MarketplaceFilter from '../../_components/marketplace/MarketplaceFilter.svelte'

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  $: listingsFetcher = () => getMarketplaceHistory($currentInstance, $accessToken, $currentSparkId)
</script>

{#if $isUserLoggedIn }
    <DynamicPageBanner title="{intl.marketplaceTitle}" icon="#nft-diamond" />
    <MarketplaceFilter filter="history" />
    <ListingsPage {listingsFetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-marketplace-notice-aside">
              {intl.marketplaceEmpty}
          </InfoAside>
        </span>
    </ListingsPage>
{:else}
    <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}

<style>
    :global(.empty-marketplace-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>