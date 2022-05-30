<script>
  import Status from '../status/Status.svelte'

  export let virtualProps;
  export let virtualIndex;
  export let virtualLength;
</script>

<Status status={virtualProps.status}
        timelineType={virtualProps.timelineType}
        timelineValue={virtualProps.timelineValue}
        enableShortcuts={true}
        index={virtualIndex}
        length={virtualLength}
        on:recalculateHeight />