<script>
  import ReleasesPage from '../../_components/marketplace/ReleasesPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import MarketplaceFilter from '../../_components/marketplace/MarketplaceFilter.svelte'
  import { currentInstance, isUserLoggedIn } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getMarketplaceReleases } from '../../_api/releases'

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  $: releasesFetcher = () => getMarketplaceReleases($currentInstance, $accessToken, $currentSparkId)
</script>

{#if $isUserLoggedIn }
    <DynamicPageBanner title="{intl.marketplaceTitle}" icon="#nft-diamond" />
    <MarketplaceFilter filter="releases" />
    <ReleasesPage {releasesFetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-releases-notice-aside">
              {intl.releasesEmpty}
          </InfoAside>
        </span>
    </ReleasesPage>
{:else}
    <HiddenFromSSR>
        <FreeTextLayout>
            <h1>{intl.releases}</h1>

            <p>{intl.marketplaceReleasesNotLoggedIn}</p>
        </FreeTextLayout>
    </HiddenFromSSR>
{/if}

<style>
    :global(.empty-releases-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>