<script>
  import { mark, stop } from '../_utils/marks'
  import { reduceMotion } from '../_store/local'
  import { throttleTimer } from '../_utils/throttleTimer'
  import { classname } from '../_utils/classname'
  import {onMount} from "svelte";

  const updateDisplayedLength = process.browser && throttleTimer(requestAnimationFrame)

  export let style = '';
  export let length;
  export let overLimit;
  export let max;

  let shouldAnimate = false;
  let lengthAsFractionDeferred = 0;

  $: lengthAsFraction = (() => {
    // We don't need to update the gauge for every decimal point, so round it to the nearest 0.02
    const int = Math.round(Math.min(max, length) / max * 100)
    return (int - (int % 2)) / 100
  })();
  $: computedClass = classname(
    'length-gauge',
    !$reduceMotion && shouldAnimate && 'should-animate',
    overLimit && 'over-char-limit'
  );
  $: computedStyle = `transform: scaleX(${lengthAsFractionDeferred}); ${style}`;

  function observeLengthAsFraction(lengthAsFraction) {
    updateDisplayedLength(() => {
      mark('set lengthAsFractionDeferred')
      lengthAsFractionDeferred = lengthAsFraction;
      stop('set lengthAsFractionDeferred')
      requestAnimationFrame(() => { shouldAnimate = true })
    })
  }

  $: observeLengthAsFraction(lengthAsFraction);

  onMount(() => {
    lengthAsFractionDeferred = lengthAsFraction;
    // perf improvement for keyboard input latency
    // this.observe('lengthAsFraction', () => {
    //   updateDisplayedLength(() => {
    //     mark('set lengthAsFractionDeferred')
    //     const { lengthAsFraction } = this.get()
    //     this.set({ lengthAsFractionDeferred: lengthAsFraction })
    //     stop('set lengthAsFractionDeferred')
    //     requestAnimationFrame(() => this.set({ shouldAnimate: true }))
    //   })
    // }, { init: false })
  });
</script>

<div class={computedClass}
     style={computedStyle}
     aria-hidden="true"
></div>
<style>
    .length-gauge {
        height: 2px;
        background: var(--main-theme-color);
        transform-origin: left;
    }
    .length-gauge.should-animate {
        transition: transform 0.2s linear;
    }
    .length-gauge.over-char-limit {
        background: var(--warning-color);
    }
</style>