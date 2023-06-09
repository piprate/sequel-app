<script>
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'

  export let params
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="tag/{params.tagName}">
    <DynamicPageBanner title={'#' + params.tagName} />
  </TimelinePage>
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
