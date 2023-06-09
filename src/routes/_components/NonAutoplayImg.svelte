<script>
  import { mouseover } from '../_utils/events'
  import { decodeImage } from '../_utils/decodeImage'
  import { classname } from '../_utils/classname'
  import { ONE_TRANSPARENT_PIXEL } from '../_static/media'
  import { createEventDispatcher, onMount } from 'svelte'
  import { loadSecureMedia } from '../_api/media'
  import { accessToken } from '../_store/instance'

  export let className
  export let ariaHidden = false
  export let alt = ''
  export let secure = false
  export let src
  export let staticSrc
  export let width
  export let height
  export let isLink

  let title = ''
  let mouseOver = false
  let loaded = false

  let image
  let mouseOverImage

  $: computedClass = classname(className, src !== staticSrc && 'non-autoplay-zoom-in', isLink && 'is-link')

  $: currentSrc = mouseOver ? src : staticSrc
  // using a transparent pixel as placeholder ensures broken images don't have wrong sizes
  $: displaySrc = secure
    ? mouseOver
      ? mouseOverImage
        ? mouseOverImage
        : ONE_TRANSPARENT_PIXEL
      : image
      ? image
      : ONE_TRANSPARENT_PIXEL
    : loaded
    ? currentSrc
    : ONE_TRANSPARENT_PIXEL

  let node

  async function onMouseOver(_mouseOver) {
    mouseOver = _mouseOver
    if (secure && mouseOver && !mouseOverImage) {
      try {
        mouseOverImage = await loadSecureMedia($accessToken, currentSrc)
        dispatch('imgLoad')
      } catch (e) {
        dispatch('imgLoadError', e)
      }
    }
  }

  const dispatch = createEventDispatcher()

  onMount(async () => {
    try {
      if (secure) {
        image = await loadSecureMedia($accessToken, currentSrc)
      } else {
        const image = new Image()
        image.src = currentSrc
        await decodeImage(image)
      }
      loaded = true
      dispatch('imgLoad')
    } catch (e) {
      dispatch('imgLoadError', e)
    }
  })
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
