<script>
  import StickerList from '../StickerList.svelte'

  export let post

  $: mentions = post.mentions || []
</script>

{#if mentions.length}
  <div class="post-mentions">
    <StickerList {mentions} actionType="link" />
  </div>
{/if}

<style>
  .post-mentions {
    grid-area: mentions;
    margin: 5px 0;
    font-size: 0.9em;
  }

  :global(.underline-links .post-mentions a) {
    text-decoration: underline;
  }
</style>
