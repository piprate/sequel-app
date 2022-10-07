<script>
  import BubblesListPage from '../../_components/BubblesListPage.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import BubbleBrowserFilter from '../../_components/bubble/BubbleBrowserFilter.svelte'
  import { currentInstance, isUserLoggedIn, pinnedPages } from '../../_store/local'
  import { accessToken } from '../../_store/instance'
  import { getBubbleList } from '../../_api/bubbles'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: bubblesFetcher = () => $isUserLoggedIn ? getBubbleList($currentInstance, $accessToken) : []
</script>

{#if $isUserLoggedIn }
    {#if $pinnedPages !== '/bubbles'}
        <DynamicPageBanner title="{intl.bubbles}" icon="#fa-comments"/>
    {/if}
    <BubbleBrowserFilter filter="explore" />
    <BubblesListPage {bubblesFetcher} />
{/if}
