<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedListing } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { clearListing, updateListing } from '../../_actions/marketplace'
  import Listing from './Listing.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let id
  export let newListing = false

  $: listingName = ($observedListing && $observedListing.object && $observedListing.object.name) || ''
  $: ariaTitle = formatIntl('intl.listingPage', { listing: listingName })

  let notFound = false
  let loadError

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        await clearListing()
        await updateListing(id)
        notFound = !$observedListing
      } catch (err) {
        console.error(err)
        loadError = err
      }
    }
    console.log('LOADED LISTING', $observedListing)
  })
</script>

{#if $isUserLoggedIn}
  {#if $observedListing}
    {#if !newListing}
      <DynamicPageBanner title="" {ariaTitle} />
    {/if}
    <Listing listing={$observedListing} ourSpark={$currentSpark} />
  {:else if notFound}
    <FreeTextLayout>
      <h2>{intl.listingNotFound}</h2>
    </FreeTextLayout>
  {:else if loadError}
    <ErrorMessage error={loadError} />
  {:else}
    <LoadingPage />
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
