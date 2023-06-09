<script>
  import { autoplayGifs, isMobileSize } from '../../_store/local'
  import NonAutoplayImg from '../NonAutoplayImg.svelte'
  import { classname } from '../../_utils/classname'
  import LazyImage from '../LazyImage.svelte'
  import SvgIcon from '../SvgIcon.svelte'

  export let content
  export let size = 'medium'
  export let isLink = false
  export let flatMode = false
  export let secure = false

  let className = undefined
  let loaded = false
  let error = undefined

  $: computedClass = classname('media-view', className, loaded && 'loaded')

  $: width = ((size, isMobileSize) => {
    switch (size) {
      case 'small':
        return 48
      case 'big':
        return isMobileSize ? 160 : 200
      case 'wide':
        return isMobileSize ? 300 : 250 // larger size for 1-column grid, and smaller - for 2-column grid
      case 'medium':
      default:
        return 64
    }
  })(size, $isMobileSize)

  $: height = 'auto'
  $: svgStyle = `width: ${width}px; height: ${width}px;`
  $: staticSrc = content ? content.staticUrl : ''
  $: src = flatMode ? staticSrc : content ? content.url : ''
  $: showDefaultIcon = error || !content
</script>

<div class="media-view-wrapper">
  {#if showDefaultIcon}
    <SvgIcon className={computedClass} style={svgStyle} href="#fa-user" />
  {:else if $autoplayGifs}
    <LazyImage
      ariaHidden="true"
      forceSize="true"
      alt=""
      {src}
      {width}
      {height}
      on:imgLoad={() => {
        loaded = true
      }}
      on:imgLoadError={() => {
        error = true
      }}
    />
  {:else}
    <NonAutoplayImg
      className={computedClass}
      ariaHidden="true"
      alt=""
      {src}
      {staticSrc}
      {width}
      {height}
      {isLink}
      {secure}
      on:imgLoad={() => {
        loaded = true
      }}
      on:imgLoadError={() => {
        error = true
      }}
    />
  {/if}
</div>

<style>
  .media-view-wrapper {
    position: relative;
    font-size: 0;
  }

  :global(.media-view) {
    border-radius: 4px;
    background: var(--loading-bg);
  }

  :global(.media-view.loaded) {
    background: none;
  }

  :global(svg.media-view) {
    fill: var(--deemphasized-text-color);
  }
</style>
