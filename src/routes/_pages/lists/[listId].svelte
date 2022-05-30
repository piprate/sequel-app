<script>
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import { pinnedPage, lists } from '../../_store/instance.js'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'

  export let params;

  $: list = $lists && $lists.find(_ => _.id === params.listId);
  $: listTitle = list ? list.title : '';
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="list/{params.listId}">
    {#if $pinnedPage !== `/lists/${params.listId}`}
      <DynamicPageBanner title={listTitle} icon="#fa-bars"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.list}</h1>

      <p>{intl.listNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
