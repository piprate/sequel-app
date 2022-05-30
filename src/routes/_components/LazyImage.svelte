<script>
  import { coordsToPercent } from '../_utils/coordsToPercent'
  import { largeInlineMedia } from '../_store/local'
  import { onMount } from "svelte";
  import { loadSecureMedia } from "../_api/media";
  import { accessToken } from "../_store/instance";

  export let ariaHidden = false;
  export let forceSize = false;
  export let title = '';
  export let alt = '';
  export let src;
  export let width = undefined;
  export let height = undefined;
  export let fallback = undefined;
  export let blurhash = undefined;
  export let focus = undefined;
  export let background = '';

  let error = false;

  $: computedStyle = [
    background && `background: ${background};`
  ].filter(Boolean).join('')

  let image;

  $: focusStyle = ((focus) => {
    // Here we do a pure css version instead of using
    // https://github.com/jonom/jquery-focuspoint#1-calculate-your-images-focus-point

    if (!focus) {
      return 'background-position: center;'
    }
    return `object-position: ${coordsToPercent(focus.x)}% ${100 - coordsToPercent(focus.y)}%;`
  })(focus);

  $: fillFixSize = !$largeInlineMedia && !forceSize;
  $: displaySrc = blurhash || (error && fallback) || image || fallback;

  let node;

  onMount(async () => {
    try {
      image = await loadSecureMedia($accessToken, src);
    } catch (e) {
      console.error('Image loading error', src, e)
      error = true;
    }
  });
</script>

<div class="lazy-image {fillFixSize ? 'lazy-image-fixed-size': ''}" style={computedStyle} >
  <img
    class="{fillFixSize ? 'fixed-size-img': ''}"
    aria-hidden={ariaHidden}
    {alt}
    {title}
    {width}
    {height}
    src={displaySrc}
    style={focusStyle}
    bind:this={node}
  />
</div>
<style>
  .lazy-image {
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
  }

  .fixed-size-img {
    width: 100%;
    height: 100%;
  }
  .lazy-image-fixed-size {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
