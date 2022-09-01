<script>
  import ListingsPage from '../../../../_components/marketplace/ListingsPage.svelte'
  import DynamicPageBanner from '../../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../../_components/InfoAside.svelte'
  import HiddenFromSSR from '../../../../_components/HiddenFromSSR.svelte'
  import FreeTextLayout from '../../../../_components/FreeTextLayout.svelte'
  import MarketplaceFilter from '../../../../_components/marketplace/MarketplaceFilter.svelte'
  import ReleaseCard from '../../../../_components/marketplace/ReleaseCard.svelte'
  import { currentInstance, isUserLoggedIn } from '../../../../_store/local'
  import { accessToken, currentSparkId } from '../../../../_store/instance'
  import { getReleaseListings } from '../../../../_api/marketplace'
  import { formatIntl } from '../../../../_utils/formatIntl'
  import { getMarketplaceRelease } from '../../../../_api/releases'
  import { onMount } from 'svelte'

  export let params

  // suppress warnings
  const intl = {}

  let release = undefined
  let loading = true
  let notFound = false

  $: listingsFetcher = () => getReleaseListings($currentInstance, $accessToken, $currentSparkId, params.id)
  $: releaseName = (release && release.name) || ''
  $: ariaTitle = formatIntl('intl.releasePage', { release: releaseName })

  onMount(async () => {
    if ($isUserLoggedIn) {
      release = await getMarketplaceRelease($currentInstance, $accessToken, params.id, $currentSparkId)
      notFound = !!release
    }
    loading = false
    console.log("LOADED RELEASE", release)
  })
</script>

{#if $isUserLoggedIn }
    <DynamicPageBanner title="" {ariaTitle} />
    <MarketplaceFilter filter="releases" />
    {#if release}
        <ReleaseCard {release} listMode={false} />
    {/if}
    <ListingsPage {listingsFetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-marketplace-notice-aside">
              {intl.releaseEmpty}
          </InfoAside>
        </span>
    </ListingsPage>
{:else}
    <HiddenFromSSR>
        <FreeTextLayout>
            <h1>{intl.release}</h1>

            <p>{intl.marketplaceReleasesNotLoggedIn}</p>
        </FreeTextLayout>
    </HiddenFromSSR>
{/if}

<style>
    :global(.empty-marketplace-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>