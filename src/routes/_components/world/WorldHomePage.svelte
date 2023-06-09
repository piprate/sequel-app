<script>
  import TimelinePage from '../TimelinePage.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedWorld, observedWorldRelationship } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte'
  import InfoAside from '../InfoAside.svelte'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { clearWorldProfileAndRelationship, updateWorldProfileAndRelationship } from '../../_actions/worlds'
  import WorldProfile from './WorldProfile.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let worldId
  export let newWorld = false
  export let filter

  $: worldName = ($observedWorld && $observedWorld.name) || ''
  $: timeline = `world/${worldId}` + (filter ? `/${filter}` : '')
  $: ariaTitle = formatIntl('intl.homePageForWorld', { world: worldName })

  let notFound = false
  let loadError

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        await clearWorldProfileAndRelationship()
        await updateWorldProfileAndRelationship(worldId)
        notFound = !$observedWorld
      } catch (e) {
        console.error(e)
        loadError = e
      }
    }
  })
</script>

{#if $isUserLoggedIn}
  {#if $observedWorld}
    {#if !newWorld}
      <DynamicPageBanner title="" {ariaTitle} />
    {/if}
    <TimelinePage {timeline}>
      <WorldProfile
        world={$observedWorld}
        relationship={$observedWorldRelationship}
        ourSpark={$currentSpark}
        {filter}
      />
      {#if $observedWorld.postCount}
        <InfoAside className="post-note">
          {intl.postInBubble}
        </InfoAside>
      {/if}
    </TimelinePage>
  {:else if notFound}
    <FreeTextLayout>
      <h2>{intl.worldNotFound}</h2>
    </FreeTextLayout>
  {:else if loadError}
    <ErrorMessage error={loadError} />
  {:else}
    <LoadingPage />
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}

<style>
  :global(.post-note) {
    margin: 20px;
  }
  :global(.post-note span) {
    font-size: 0.9em;
  }
</style>
