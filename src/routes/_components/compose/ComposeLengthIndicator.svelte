<script>
  import LengthIndicator from '../LengthIndicator.svelte'
  import { maxStatusChars } from '../../_store/instance'

  export let length;
  export let overLimit;
</script>

<LengthIndicator
        {length}
        {overLimit}
        max={$maxStatusChars}
        style="grid-area: length; justify-self: right; align-self: center;"
/>