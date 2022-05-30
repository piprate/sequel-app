<script>
  import ListingsPage from '../../_components/marketplace/ListingsPage.svelte';
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte';
  import InfoAside from '../../_components/InfoAside.svelte';
  import { currentInstance, isUserLoggedIn } from "../../_store/local";
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getMarketplaceListings } from "../../_api/marketplace";

  export let params;
  params = undefined;

  // suppress warnings
  const intl = {};

  $: sparkSelected = !!$currentSparkId
  $: listingsFetcher = () => $isUserLoggedIn ? getMarketplaceListings($currentInstance, $accessToken) : [];
</script>

<DynamicPageBanner title="{intl.marketplaceTitle}" icon="#nft-diamond" />
{#if $isUserLoggedIn }
    <ListingsPage {listingsFetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-marketplace-notice-aside">
              {intl.marketplaceComingSoon}
          </InfoAside>
        </span>
    </ListingsPage>
{/if}

<style>
    :global(.empty-marketplace-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>