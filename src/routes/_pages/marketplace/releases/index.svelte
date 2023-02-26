<script>
  import ReleasesPage from '../../../_components/marketplace/ReleasesPage.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../_components/InfoAside.svelte'
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import MarketplaceFilter from '../../../_components/marketplace/MarketplaceFilter.svelte'
  import { currentInstance, isUserLoggedIn } from '../../../_store/local'
  import { accessToken, currentSparkId } from '../../../_store/instance'
  import { getMarketplaceReleases } from '../../../_api/releases'

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
        <div slot="header" class="releases-header">
            <a href='/marketplace/releases/new' class="button primary">
                Create new Release
            </a>
        </div>
        <span slot="is-empty">
            <InfoAside className="empty-releases-notice-aside">
              {intl.releasesEmpty}
          </InfoAside>
        </span>
    </ReleasesPage>
{:else}
    <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}

<style>
    :global(.empty-releases-notice-aside) {
        margin: 10px 10px 0 0;
    }

    .releases-header {
        margin-bottom: 1.5rem;
    }
</style>