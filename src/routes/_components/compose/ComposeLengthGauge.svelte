<script>
  import LengthGauge from '../LengthGauge.svelte'
  import { maxPostChars } from '../../_store/instance'

  export let length;
  export let overLimit;
</script>

<LengthGauge style="grid-area: gauge; margin: 0 0 5px 5px;"
             {length}
             {overLimit}
             max={$maxPostChars}
/>