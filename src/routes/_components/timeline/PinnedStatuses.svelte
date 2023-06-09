<script>
  import Post from '../post/Post.svelte'
  import { updatePinnedPostsForSpark } from '../../_actions/pinnedPosts'
  import { on } from '../../_utils/eventBus'
  import { currentInstance, pinnedPosts } from '../../_store/local'
  import { onMount } from 'svelte'
  import { currentSparkId } from '../../_store/instance'

  export let sparkId

  $: pinnedPostsList = (() => {
    return ($pinnedPosts[$currentInstance] && $pinnedPosts[$currentInstance][sparkId]) || []
  })()

  async function updatePinnedPosts() {
    await updatePinnedPostsForSpark(sparkId, $currentSparkId)
  }

  onMount(async () => {
    const removeListener = on('updatePinnedPosts', updatePinnedPosts)
    await updatePinnedPosts()
    return removeListener
  })
</script>

{#if pinnedPostsList.length}
  <h1 class="sr-only">{intl.pinnedPosts}</h1>
  <div role="feed" aria-label={intl.pinnedPosts} class="pinned-posts">
    {#each pinnedPostsList as post, index (post.id)}
      <div class="pinned-post-wrapper">
        <!-- empty div used because we assume the parent of the <article> gets the focus outline -->
        <Post
          {post}
          timelineType="pinned"
          timelineValue={sparkId}
          {index}
          length={pinnedPostsList.length}
          enableShortcuts={true}
        />
      </div>
    {/each}
  </div>
{/if}

<style>
  .pinned-post-wrapper:first-child {
    margin: 2px 0; /* gives room for the focus outline */
  }
</style>
