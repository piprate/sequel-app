<script>
  import { getSubscribers } from '../../../_api/subscription'
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import FreeTextLayout from '../../../_components/FreeTextLayout.svelte'
  import InfoAside from '../../../_components/InfoAside.svelte'
  import { currentInstance, isAuthenticated } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'

  export let params

  $: sparkId = params.sparkId
  $: sparksFetcher = () => getSubscribers($currentInstance, $accessToken, sparkId)
</script>

{#if $isAuthenticated }
    <DynamicPageBanner title="{intl.subscribers}" />
    <FreeTextLayout>
        <InfoAside className="new-entity-notice-aside">
            {intl.featureNotImplemented}
        </InfoAside>
    </FreeTextLayout>
    <!--<SparksListPage {sparksFetcher} />-->
{:else}
    <RestrictedPageWarning message="{intl.accessRestricted}" />
{/if}