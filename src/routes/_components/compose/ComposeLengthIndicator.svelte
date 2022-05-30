<script>
  import LengthIndicator from '../LengthIndicator.svelte'
  import { maxPostChars } from '../../_store/instance'

  export let length;
  export let overLimit;
</script>

<LengthIndicator
        {length}
        {overLimit}
        max={$maxPostChars}
        style="grid-area: length; justify-self: right; align-self: center;"
/>