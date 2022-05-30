<script>
  import { mouseover } from '../_utils/events'
  import PlayVideoIcon from './PlayVideoIcon.svelte'
  import { ONE_TRANSPARENT_PIXEL } from '../_static/media'
  import LazyImage from './LazyImage.svelte'
  import AutoplayVideo from './AutoplayVideo.svelte'
  import { largeInlineMedia } from "../_store/local";

  export let label;
  export let poster;
  export let blurhash;
  export let src;
  export let staticSrc;
  export let useWidthHeight;
  export let width;
  export let height;
  export let playing = false;
  export let focus = undefined;

  let oneTransparentPixel = ONE_TRANSPARENT_PIXEL;

  $: style =  useWidthHeight ? `width: ${width}px; height: ${height}px;` : '';

  let node;

  function onMouseOver (mouseOver) {
    playing = mouseOver;
  }
</script>

<div class="non-autoplay-gifv  {$largeInlineMedia ? '' : 'non-autoplay-gifv-fixed-size'}"
     {style}
     use:mouseover={onMouseOver}
     bind:this={node}
>
  {#if playing}
    <AutoplayVideo
            ariaLabel={label}
            {poster}
            {src}
            {width}
            {height}
            {focus}
    />
  {:else}
    <LazyImage
            alt={label || ''}
            title={label || ''}
            src={staticSrc}
            {blurhash}
            fallback={oneTransparentPixel}
            {width}
            {height}
            background="var(--loading-bg)"
            {focus}
    />
  {/if}
  {#if !blurhash}
    <PlayVideoIcon className={playing ? 'hidden' : ''}/>
  {/if}
</div>
<style>
  .non-autoplay-gifv {
    cursor: zoom-in;
    display: flex;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .non-autoplay-gifv-fixed-size {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }


  :global(.non-autoplay-gifv .play-video-icon) {
    transition: opacity 0.2s linear;
  }
</style>