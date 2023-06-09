<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedDigitalArt } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { clearDigitalArt, updateDigitalArt } from '../../_actions/digitalArt'
  import DigitalArt from './DigitalArt.svelte'
  import { onMount } from 'svelte'

  export let id
  export let newDigitalArt = false

  $: name = ($observedDigitalArt && $observedDigitalArt.name) || ''
  $: ariaTitle = name

  let notFound = false
  let loadError

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        await clearDigitalArt()
        await updateDigitalArt(id)
        notFound = !$observedDigitalArt
      } catch (e) {
        console.error(e)
        loadError = e
      }
    }
    console.log('LOADED DIGITAL ART', $observedDigitalArt)
  })
</script>

{#if $isUserLoggedIn}
  {#if $observedDigitalArt}
    {#if !newDigitalArt}
      <DynamicPageBanner title="" {ariaTitle} />
    {/if}
    <DigitalArt digitalArt={$observedDigitalArt} ourSpark={$currentSpark} />
  {:else if notFound}
    <FreeTextLayout>
      <h2>{intl.digitalArtNotFound}</h2>
    </FreeTextLayout>
  {:else if loadError}
    <ErrorMessage error={loadError} />
  {:else}
    <LoadingPage />
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
