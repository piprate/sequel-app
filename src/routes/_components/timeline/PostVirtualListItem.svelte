<script>
  import { isTimelineInReaderMode } from '../../_actions/timeline';
  import { currentTimeline } from '../../_store/local';
  import { timelineGroupHeads } from '../../_store/timeline';
  import Post from '../post/Post.svelte'
  import ReaderModePost from '../post/ReaderModePost.svelte';

  export let virtualProps;
  export let virtualIndex;
  export let virtualLength;

  $: isInReaderMode = isTimelineInReaderMode($currentTimeline)
  $: groupHeads = $timelineGroupHeads
  $: isGroupHead = groupHeads?.find(_ => _.id === virtualProps.post.id)
</script>

{#if isInReaderMode}
  <ReaderModePost post={virtualProps.post}
    timelineType={virtualProps.timelineType}
    timelineValue={virtualProps.timelineValue}
    index={virtualIndex}
    length={virtualLength}
    {isGroupHead}
    on:recalculateHeight />
{:else}
  <Post post={virtualProps.post}
    timelineType={virtualProps.timelineType}
    timelineValue={virtualProps.timelineValue}
    enableShortcuts={true}
    index={virtualIndex}
    length={virtualLength}
    on:recalculateHeight />
{/if}