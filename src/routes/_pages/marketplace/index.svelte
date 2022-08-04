<script>
  import ListingsPage from '../../_components/marketplace/ListingsPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { currentInstance, isUserLoggedIn } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getMarketplaceListings } from '../../_api/marketplace'

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  $: listingsFetcher = () => getMarketplaceListings($currentInstance, $accessToken, $currentSparkId)
</script>

{#if $isUserLoggedIn }
    <DynamicPageBanner title="{intl.marketplaceTitle}" icon="#nft-diamond" />
    <ListingsPage {listingsFetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-marketplace-notice-aside">
              {intl.marketplaceEmpty}
          </InfoAside>
        </span>
    </ListingsPage>
{:else}
    <HiddenFromSSR>
        <FreeTextLayout>
            <h1>{intl.marketplaceTitle}</h1>

            <p>{intl.marketplaceNotLoggedIn}</p>
        </FreeTextLayout>
    </HiddenFromSSR>
{/if}

<style>
    :global(.empty-marketplace-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>