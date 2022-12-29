<script>
  export let uuid
  export let post
  export let isPostInOwnThread

  $: mentions = post.mentions || []
</script>

{#if mentions.length}
  <div class="post-mentions {isPostInOwnThread ? 'post-in-own-thread' : ''}">
    <p>
      {#each mentions as mention, i}
        {#if i > 0}
          <!-- empty space -->
          &nbsp;
          <!-- empty space -->
        {/if}
        <a id="post-mention-link-{uuid}-{mention.id}"
           href="/sparks/{mention.id}"
           data-sveltekit-preload-data
           title="@{mention.acct}"
        >
          @{mention.username}
        </a>
      {/each}
    </p>
  </div>
{/if}
<style>
  .post-mentions {
    grid-area: mentions;
    margin: 10px 0 10px 5px;
    font-size: 0.9em;
  }

  .post-mentions.post-in-own-thread {
    font-size: 1.3em;
    margin: 20px 10px 20px 5px;
  }

  :global(.underline-links .post-mentions a) {
    text-decoration: underline;
  }

</style>
