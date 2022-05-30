<script>
  import BubblesListPage from '../../_components/BubblesListPage.svelte';
  import BubbleBrowserFilter from '../../_components/bubble/BubbleBrowserFilter.svelte';
  import { currentInstance, isUserLoggedIn } from "../../_store/local";
  import { accessToken } from "../../_store/instance";
  import { getBubbleList } from "../../_api/bubbles";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: bubblesFetcher = () => $isUserLoggedIn ? getBubbleList($currentInstance, $accessToken) : [];
</script>

{#if $isUserLoggedIn }
    <BubbleBrowserFilter filter="explore" />
    <BubblesListPage {bubblesFetcher} />
{/if}
