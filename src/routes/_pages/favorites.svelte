<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="favorites">
    {#if $pinnedPage !== '/favorites'}
      <DynamicPageBanner title="{intl.favorites}" icon="#fa-star"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.favorites}</h1>

      <p>{intl.favoritesNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
