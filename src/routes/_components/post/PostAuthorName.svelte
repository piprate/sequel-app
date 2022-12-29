<script>
  import SparkDisplayName from '../spark/SparkDisplayName.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let uuid
  export let isPostInNotification
  export let isPostInOwnThread
  export let postAuthor
  export let postAuthorId

  $: elementId = `post-author-name-${uuid}`
</script>

<a id={elementId}
   class="post-author-name {isPostInNotification ? 'post-in-notification' : '' } {isPostInOwnThread ? 'post-in-own-thread' : ''}"
   data-sveltekit-preload-data
   href="/sparks/{unwrap(postAuthorId)}"
   title="{'@' + postAuthor.acct}"
>
  <SparkDisplayName spark={postAuthor} />
</a>
<style>
  .post-author-name {
    grid-area: author-name;
    align-self: center;
    margin-left: 5px;
    font-size: 1.1em;
    min-width: 0;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-author-name.post-in-own-thread {
    font-size: 1.3em;
  }

  .post-author-name, .post-author-name:hover, .post-author-name:visited {
    color: var(--body-text-color);
  }

  .post-author-name.post-in-notification,
  .post-author-name.post-in-notification:hover,
  .post-author-name.post-in-notification:visited {
    color: var(--very-deemphasized-text-color);
  }

</style>
