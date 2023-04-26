<script>
  import SparkDisplayName from '../spark/SparkDisplayName.svelte'
  import { unwrap } from '../../_utils/mapper'
  import { onMount } from 'svelte';
  import { isUserLoggedIn, observedSpark } from '../../_store/local';
  import { clearProfileAndRelationship, updateProfileAndRelationship } from '../../_actions/sparks';

  export let uuid
  export let isPostInNotification
  export let isPostInOwnThread
  export let postAuthor
  export let postAuthorId

  $: elementId = `post-author-name-${uuid}`
  $: spark = $observedSpark
  $: postCount = spark?.postCount || 0
  $: bubbleCount = spark?.bubbleCount || 0
  $: subscriberCount = spark?.subscriberCount || 0

  onMount(async () => {
    if (isPostInOwnThread) {
      if ($isUserLoggedIn) {
        await clearProfileAndRelationship()
        await updateProfileAndRelationship(unwrap(postAuthorId))
      }
    }
  })
</script>

<a id={elementId}
   class="post-author-name {isPostInNotification ? 'post-in-notification' : '' } {isPostInOwnThread ? 'post-in-own-thread' : ''}"
   data-sveltekit-preload-data
   href="/sparks/{unwrap(postAuthorId)}"
   title="{'@' + postAuthor.acct}"
>
  <SparkDisplayName spark={postAuthor} />
</a>
{#if isPostInOwnThread}
  <div class="spark-stats">
    Posts: {postCount} Bubbles: {bubbleCount} Subscribers: {subscriberCount}
  </div>
{/if}
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

  .spark-stats {
    margin-left: 4px;
    color: var(--very-deemphasized-text-color);
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
