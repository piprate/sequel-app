<script>
  import LengthIndicator from '../LengthIndicator.svelte'
  import { MAX_POST_LENGTH } from '../../_static/posts'

  export let length
  export let overLimit
</script>

<LengthIndicator
        {length}
        {overLimit}
        max={MAX_POST_LENGTH}
        style="grid-area: length; justify-self: right; align-self: center;"
/>