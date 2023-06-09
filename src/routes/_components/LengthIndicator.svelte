<script>
  import { mark, stop } from '../_utils/marks'
  import { throttleTimer } from '../_utils/throttleTimer'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from 'svelte'
  import { inBrowser } from '../_utils/browserOrNode'

  const updateDisplayedLength = inBrowser() && throttleTimer(requestAnimationFrame)

  export let length
  export let overLimit
  export let max
  export let style = ''

  let lengthToDisplayDeferred = 0

  $: lengthToDisplay = max - length
  $: lengthLabel = (() => {
    if (overLimit) {
      return formatIntl('intl.overLimit', { count: -lengthToDisplayDeferred })
    } else {
      return formatIntl('intl.underLimit', { count: lengthToDisplayDeferred })
    }
  })()

  $: {
    updateDisplayedLength(() => {
      mark('set lengthToDisplayDeferred')
      lengthToDisplayDeferred = lengthToDisplay
      stop('set lengthToDisplayDeferred')
    })
  }

  onMount(() => {
    lengthToDisplayDeferred = lengthToDisplay
    // perf improvement for keyboard input latency
    // this.observe('lengthToDisplay', () => {
    //   updateDisplayedLength(() => {
    //     mark('set lengthToDisplayDeferred')
    //     lengthToDisplayDeferred = lengthToDisplay;
    //     stop('set lengthToDisplayDeferred')
    //   })
    // }, { init: false })
  })
</script>

<span class="length-indicator {overLimit ? 'over-char-limit' : ''}" aria-label={lengthLabel} {style}
  >{lengthToDisplayDeferred}</span
>

<style>
  .length-indicator {
    color: var(--length-indicator-color);
    font-size: 1.3em;
  }

  .length-indicator.over-char-limit {
    color: var(--warning-color);
  }
</style>
