<script>
  import TimelinePage from '../TimelinePage.svelte';
  import FreeTextLayout from '../FreeTextLayout.svelte';
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedWorld, observedWorldRelationship } from '../../_store/local.js';
  import { currentSpark } from '../../_store/instance.js';
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte';
  import DynamicPageBanner from '../DynamicPageBanner.svelte';
  import { clearWorldProfileAndRelationship, updateWorldProfileAndRelationship } from '../../_actions/worlds';
  import WorldProfile from './WorldProfile.svelte';
  import { formatIntl } from '../../_utils/formatIntl';
  import { onMount } from "svelte";

  export let worldId;
  export let newWorld = false;
  export let filter;

  $: worldName = ($observedWorld && $observedWorld.name) || '';
  $: timeline = `world/${worldId}` + (filter ? `/${filter}` : '');
  $: ariaTitle = formatIntl('intl.homePageForWorld', { world: worldName });

  let loading = true;
  let notFound = false;

  onMount(() => {
    if ($isUserLoggedIn) {
      clearWorldProfileAndRelationship();
      updateWorldProfileAndRelationship(worldId);
      notFound = !!$observedWorld;
    }
    loading = false;
  });
</script>

{#if loading}
    <LoadingPage />
{:else}
    {#if $isUserLoggedIn}
        {#if $observedWorld}
            {#if !newWorld}
                <DynamicPageBanner title="" {ariaTitle} />
            {/if}
            <TimelinePage {timeline} >
                <WorldProfile world={$observedWorld}
                              relationship={$observedWorldRelationship}
                              ourSpark={$currentSpark}
                              {filter}
                />
            </TimelinePage>
        {:else if notFound}
            <FreeTextLayout>
                <h2>{intl.worldNotFound}</h2>
            </FreeTextLayout>
        {/if}
    {:else}
        <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
    {/if}
{/if}