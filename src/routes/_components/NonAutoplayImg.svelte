<script>
  import { mouseover } from '../_utils/events'
  import { decodeImage } from '../_utils/decodeImage'
  import { classname } from '../_utils/classname'
  import { ONE_TRANSPARENT_PIXEL } from '../_static/media'
  import { createEventDispatcher, onMount } from "svelte";

  export let className;
  export let ariaHidden = false;
  export let alt = '';
  export let src;
  export let staticSrc;
  export let width;
  export let height;
  export let isLink;

  let title = '';
  let mouseOver = false;
  let loaded = false;

  $: computedClass = (classname(
    className,
    src !== staticSrc && 'non-autoplay-zoom-in',
    isLink && 'is-link'
  ));

  $: currentSrc = mouseOver ? src : staticSrc;
  // using a transparent pixel as placeholder ensures broken images don't have wrong sizes
  $: displaySrc = loaded ? currentSrc : ONE_TRANSPARENT_PIXEL;

  let node;

  function onMouseOver(_mouseOver) {
    mouseOver = _mouseOver;
  }

  const dispatch = createEventDispatcher();

  onMount(async () => {
    try {
      const image = new Image()
      image.src = currentSrc
      await decodeImage(image)
      loaded = true;
      dispatch('imgLoad')
    } catch (e) {
      dispatch('imgLoadError', e)
    }
  });
</script>

<img
  class={computedClass}
  aria-hidden={ariaHidden}
  {alt}
  {title}
  {width}
  {height}
  src={displaySrc}
  bind:this={node}
  use:mouseover={onMouseOver}
/>
<style>
  .non-autoplay-zoom-in {
    cursor: zoom-in;
  }
  .non-autoplay-zoom-in.is-link {
    cursor: pointer;
  }
</style>
