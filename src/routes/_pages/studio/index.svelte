<script>
  import DigitalArtsPage from '../../_components/studio/DigitalArtsPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isAuthenticated } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getDigitalArts } from '../../_api/studio'

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  $: fetcher = () => getDigitalArts($currentInstance, $accessToken, $currentSparkId)
</script>

{#if $isAuthenticated }
    <DynamicPageBanner title="{intl.studio}" icon="#fa-paint-brush" />
    <DigitalArtsPage {fetcher}>
        <span slot="is-empty">
            <InfoAside className="empty-studio-notice-aside">
              {intl.studioEmpty}
          </InfoAside>
        </span>
    </DigitalArtsPage>
{:else}
    <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}

<style>
    :global(.empty-studio-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>