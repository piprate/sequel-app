<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedListing } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import HiddenFromSSR from '../HiddenFromSSR.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { clearListing, updateListing } from '../../_actions/marketplace'
  import Listing from './Listing.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let id
  export let newListing = false

  $: listingName = ($observedListing && $observedListing.object && $observedListing.object.name) || ''
  $: ariaTitle = formatIntl('intl.listingPage', { listing: listingName })

  let loading = true
  let notFound = false

  onMount(async () => {
    if ($isUserLoggedIn) {
      await clearListing()
      await updateListing(id)
      notFound = !!$observedListing
    }
    loading = false
    console.log("LOADED LISTING", $observedListing)
  })
</script>

{#if loading}
    <LoadingPage />
{:else}
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
        {/if}
    {:else}
        <HiddenFromSSR>
            <FreeTextLayout>
                <h1>{intl.listing}</h1>

                <p>{intl.listingNotLoggedIn}</p>
            </FreeTextLayout>
        </HiddenFromSSR>
    {/if}
{/if}