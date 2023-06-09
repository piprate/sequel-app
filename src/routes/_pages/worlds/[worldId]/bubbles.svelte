<script>
  import BubblesListPage from '../../../_components/BubblesListPage.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isUserLoggedIn, observedWorld } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import { getWorld, getWorldBubbleList } from '../../../_api/worlds'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let params

  // suppress warnings
  const intl = {}

  let world = $observedWorld

  $: worldName = (world && world.name) || ''
  $: pageTitle = formatIntl('intl.bubblesInWorld', { world: worldName })
  $: bubblesFetcher = () => ($isUserLoggedIn ? getWorldBubbleList($currentInstance, $accessToken, params.worldId) : [])

  onMount(async () => {
    if (!world) {
      world = await getWorld($currentInstance, $accessToken, params.worldId)
    }
  })
</script>

<DynamicPageBanner title={pageTitle} icon="#fa-comments" />
{#if $isUserLoggedIn}
  <BubblesListPage {bubblesFetcher} />
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
