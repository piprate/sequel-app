<script>
  import TimelinePage from '../TimelinePage.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedRelationship, observedSpark } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import PinnedStatuses from '../timeline/PinnedStatuses.svelte'
  import { clearProfileAndRelationship, updateProfileAndRelationship } from '../../_actions/sparks'
  import SparkProfile from './SparkProfile.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let sparkId
  export let newSpark = false
  export let filter

  $: sparkName = ($observedSpark && ($observedSpark.name || $observedSpark.handle)) || ''
  $: timeline = `spark/${sparkId}` + (filter ? `/${filter}` : '')
  $: ariaTitle = formatIntl('intl.profilePageForSpark', { spark: sparkName })

  let notFound = false
  let loadError

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        await clearProfileAndRelationship()
        await updateProfileAndRelationship(sparkId)
        notFound = !$observedSpark
      } catch (e) {
        console.error(e)
        loadError = e
      }
    }
  })
</script>

{#if $isUserLoggedIn}
  {#if $observedSpark}
    {#if !newSpark}
      <DynamicPageBanner title="" {ariaTitle} />
    {/if}
    <TimelinePage {timeline} >
      <SparkProfile spark={$observedSpark}
                    relationship={$observedRelationship}
                    ourSpark={$currentSpark}
                    {filter}
      />
      {#if !filter}
        <PinnedStatuses {sparkId} />
      {/if}
    </TimelinePage>
  {:else if notFound}
    <FreeTextLayout>
      <h2>{intl.sparkNotFound}</h2>
    </FreeTextLayout>
  {:else if loadError}
    <ErrorMessage error={loadError} />
  {:else}
    <LoadingPage />
  {/if}
{:else}
  <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}