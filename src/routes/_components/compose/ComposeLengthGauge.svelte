<script>
  import LengthGauge from '../LengthGauge.svelte'
  import { MAX_POST_LENGTH } from '../../_static/posts'

  export let length
  export let overLimit
</script>

<LengthGauge style="grid-area: gauge; margin: 0 0 5px 5px;" {length} {overLimit} max={MAX_POST_LENGTH} />
