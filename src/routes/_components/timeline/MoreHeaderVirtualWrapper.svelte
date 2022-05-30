<script>
  import MoreHeader from './MoreHeader.svelte'

  export let virtualProps;
</script>

<MoreHeader count={virtualProps.count}
            onClick={virtualProps.onClick}
/>