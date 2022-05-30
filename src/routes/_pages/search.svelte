<script>
  import { isUserLoggedIn } from '../_store/local'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import Search from '../_components/search/Search.svelte'
  import InfoAside from '../_components/InfoAside.svelte';

  // suppress warnings
  export let params;
  params = undefined;
</script>

{#if $isUserLoggedIn}
  <FreeTextLayout>
    <InfoAside className="new-entity-notice-aside">
      {intl.featureNotImplemented}
    </InfoAside>
  </FreeTextLayout>
  <div class="search-page">
    <Search></Search>
  </div>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.search}</h1>

      <p>{intl.searchNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
  <div style="display: none">
    <!-- TODO: this is just a hack so that `sapper export` knows to crawl these files -->
    <!-- Note that these links have to be spread out or else they result in ECONNRESET errors during crawling -->
    <!-- See also community/index.html -->
    <a href="/worlds">{intl.worlds}</a>
    <a href="/bubbles">{intl.bubbles}</a>
    <a href="/bookmarks">{intl.bookmarks}</a>
  </div>
{/if}
<style>
  .search-page {
    padding: 20px 20px;
  }

  @media (max-width: 767px) {
    .search-page {
      padding: 20px 10px;
    }
  }
</style>

