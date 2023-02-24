<script>
  import DigitalArtsPage from '../../_components/studio/DigitalArtsPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isAuthenticated, observedRelationship } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getDigitalArts } from '../../_api/studio'
  import { unwrap } from '../../_utils/mapper';
  import { onMount } from 'svelte';
  import { updateProfileAndRelationship } from '../../_actions/sparks';

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  onMount(async () => {
      await updateProfileAndRelationship(unwrap($currentSparkId))
    })
    
    $: fetcher = () => getDigitalArts($currentInstance, $accessToken, $currentSparkId)
    $: isTokenCreator = $observedRelationship?.tokenCreator
</script>

{#if $isAuthenticated }
    <DynamicPageBanner title="{intl.studio}" icon="#fa-paint-brush" />
    <DigitalArtsPage {fetcher}>
        <div slot="header" class="header">
            {#if isTokenCreator}
                <a class="button primary new-entity-button" data-sveltekit-preload-data href="/studio/digital-art/new">{intl.createNewDigitalArt}</a>
            {/if}
        </div>
    </DigitalArtsPage>
{:else}
    <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}

<style>
    :global(.empty-studio-notice-aside) {
        margin: 10px 10px 0 0;
    }

    .header a.primary {
        display: block;
        text-align: center;
        width: fit-content;
        margin-bottom: 1.5rem;
    }
</style>