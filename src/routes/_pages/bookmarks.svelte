<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="bookmarks">
    {#if $pinnedPage !== '/bookmarks'}
      <DynamicPageBanner title="{intl.bookmarks}" icon="#fa-bookmark"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.bookmarks}</h1>

      <p>{intl.bookmarksNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
