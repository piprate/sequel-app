<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import RestrictedPageWarning from '../_components/RestrictedPageWarning.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="bookmarks">
    {#if $pinnedPage !== '/bookmarks'}
      <DynamicPageBanner title="{intl.bookmarks}" icon="#fa-bookmark"/>
    {/if}
  </TimelinePage>
{:else}
  <RestrictedPageWarning />
{/if}
