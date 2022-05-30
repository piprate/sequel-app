<script>
  import Post from '../post/Post.svelte'

  export let virtualProps;
  export let virtualIndex;
  export let virtualLength;
</script>

<Post post={virtualProps.post}
        timelineType={virtualProps.timelineType}
        timelineValue={virtualProps.timelineValue}
        enableShortcuts={true}
        index={virtualIndex}
        length={virtualLength}
        on:recalculateHeight />