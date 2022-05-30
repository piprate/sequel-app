<script>
  import { currentInstance, isUserLoggedIn } from '../_store/local.js'
  import { accessToken, currentSpark } from '../_store/instance'
  import LoadingPage from '../_components/LoadingPage.svelte'
  import PostSearchResult from '../_components/search/PostSearchResult.svelte'
  import { toast } from '../_components/toast/toast'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { getPinnedPosts } from '../_api/pinnedPosts'
  import { updateUserForInstance } from '../_actions/instances'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from "svelte";

  // suppress warnings
  export let params;
  params = undefined;

  let loading = true;
  let posts = undefined;

  onMount(async () => {
    try {
      await updateUserForInstance($currentInstance);
      posts = await getPinnedPosts($currentInstance, $accessToken, $currentSpark.id);
    } catch (e) {
      /* no await */ toast.say(formatIntl('intl.error', { error: (e.name || '') + ' ' + (e.message || '') }))
    } finally {
      loading = false;
    }
  });
</script>

<DynamicPageBanner title="{intl.pinnedPosts}" icon="#fa-thumb-tack" />
{#if $isUserLoggedIn }
  <div class="pinned-toots-page">
    {#if loading}
      <LoadingPage />
      {:else if posts && posts.length}
      <ul class="pinned-toots-results">
        {#each posts as post, index}
          <PostSearchResult {post} {index} length={posts.length} />
        {/each}
      </ul>
    {/if}
  </div>
{/if}
<style>
  .pinned-toots-page {
    padding: 20px 20px;
    position: relative;
  }
  .pinned-toots-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .pinned-toots-page {
      padding: 20px 10px;
    }
  }
</style>