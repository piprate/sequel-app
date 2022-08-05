<script>
  import DigitalArtCollectionPage from '../../_components/asset/DigitalArtCollectionPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import FlowConnect from '../../_components/flow/FlowConnect.svelte'
  import {
    currentInstance,
    flowLoggedInAccount,
    instanceUsers,
    isAuthenticated
  } from '../../_store/local'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { readSequelDigitalArtCollection } from '../../_actions/flow'

  export let params
  params = undefined

  // suppress warnings
  const intl = {}

  $: user = ($instanceUsers && $instanceUsers[$currentInstance]) || {}
  $: flowAddress = (user && user.flow && user.flow.addr) || ''
  $: flowNetwork = (user && user.flow && user.flow.network) || ''
  $: flowAddressMismatch = $flowLoggedInAccount && flowAddress && $flowLoggedInAccount !== flowAddress
  $: notConnectedToFlow = !flowAddress || flowAddressMismatch || $flowLoggedInAccount !== flowAddress
  $: digitalArtCollectionFetcher = () => readSequelDigitalArtCollection(flowAddress)
</script>

{#if $isAuthenticated }
    {#if notConnectedToFlow }
        <FlowConnect className="flow-sign-in-dialog" />
    {:else}
        <DynamicPageBanner title="{intl.assets}" icon="#fa-bicycle" />
        <DigitalArtCollectionPage fetcher={digitalArtCollectionFetcher}>
            <span slot="is-empty">
                <InfoAside className="empty-collection-notice-aside">
                  {intl.collectionEmpty}
              </InfoAside>
            </span>
        </DigitalArtCollectionPage>
    {/if}
{:else}
    <RestrictedPageWarning message="{intl.accessRestricted}" />
{/if}

<style>
    :global(.flow-sign-in-dialog) {
        margin: 20px;
    }
    :global(.empty-collection-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>