<script>
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import { pinnedPage, lists } from '../../_store/instance.js'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'

  export let params

  $: list = $lists && $lists.find((_) => _.id === params.listId)
  $: listTitle = list ? list.title : ''
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="list/{params.listId}">
    {#if $pinnedPage !== `/lists/${params.listId}`}
      <DynamicPageBanner title={listTitle} icon="#fa-bars" />
    {/if}
  </TimelinePage>
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
