<script>
  export let isPostInNotification
  export let postAuthor
</script>

<span class="post-author-handle {isPostInNotification ? 'post-in-notification' : ''}">
  {'@' + postAuthor.username}
</span>

<style>
  .post-author-handle {
    grid-area: author-handle;
    align-self: center;
    margin-left: 5px;
    color: var(--deemphasized-text-color);
    font-size: 1.1em;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-author-handle.post-in-notification {
    color: var(--very-deemphasized-text-color);
  }
</style>
