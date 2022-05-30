<script>
  import Notification from '../post/Notification.svelte'

  export let virtualProps;
  export let virtualIndex;
  export let virtualLength;
</script>

<Notification
  notification={virtualProps.notification}
  timelineType={virtualProps.timelineType}
  timelineValue={virtualProps.timelineValue}
  enableShortcuts={true}
  index={virtualIndex}
  length={virtualLength}
  on:recalculateHeight />
