<script>
  import ListingsPage from '../../../../_components/marketplace/ListingsPage.svelte'
  import DynamicPageBanner from '../../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../../_components/InfoAside.svelte'
  import MarketplaceFilter from '../../../../_components/marketplace/MarketplaceFilter.svelte'
  import ReleaseCard from '../../../../_components/marketplace/ReleaseCard.svelte'
  import { currentInstance, isUserLoggedIn, observedRelease } from '../../../../_store/local'
  import { accessToken, currentSparkId } from '../../../../_store/instance'
  import { getReleaseListings } from '../../../../_api/releases'
  import { formatIntl } from '../../../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import RestrictedPageWarning from '../../../../_components/RestrictedPageWarning.svelte'
  import { displayError } from '../../../../_actions/errors'
  import { updateRelease } from '../../../../_actions/marketplace'
  import ReleaseDetails from '../../../../_components/marketplace/ReleaseDetails.svelte'

  export let params

  // suppress warnings
  const intl = {}

  let loading = true
  let notFound = false

  $: listingsFetcher = () => getReleaseListings($currentInstance, $accessToken, params.id, $currentSparkId)
  $: release = $observedRelease
  $: releaseName = (release && release.name) || ''
  $: ariaTitle = formatIntl('intl.releasePage', { release: releaseName })

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        updateRelease(params.id)
      } catch (e) {
        displayError(e)
      }
      notFound = !release
    }
    loading = false
    console.log('LOADED RELEASE', release)
  })
</script>

{#if $isUserLoggedIn}
  <DynamicPageBanner title="" {ariaTitle} />
  <MarketplaceFilter filter="releases" />
  {#if release}
    <ReleaseCard {release} listMode={false} />
    <ReleaseDetails {release} {listingsFetcher} />
    <ListingsPage {listingsFetcher}>
      <span slot="is-empty">
        <InfoAside className="empty-marketplace-notice-aside">
          {intl.releaseEmpty}
        </InfoAside>
      </span>
    </ListingsPage>
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}

<style>
  :global(.empty-marketplace-notice-aside) {
    margin: 10px 10px 0 0;
  }
</style>
