<script>
  import { autoplayGifs, isMobileSize } from '../_store/local'
  import NonAutoplayImg from './NonAutoplayImg.svelte'
  import { classname } from '../_utils/classname'
  import LazyImage from './LazyImage.svelte'
  import SvgIcon from './SvgIcon.svelte'
  import NFTMediaTag from './NFTMediaTag.svelte'

  export let entity
  export let size = 'medium'
  export let isLink = false
  export let flatMode = false
  export let showNFT = false
  export let secure = false

  let className = undefined
  let loaded = false
  let error = undefined

  $: computedClass = classname(
          'avatar',
          className,
          loaded && 'loaded'
  )

  $: width = ((size, isMobileSize) => {
    switch (size) {
      case 'extra-small':
        return 24
      case 'navigation':
        return 25
      case 'small':
        return 48
      case 'big':
        return isMobileSize ? 80 : 100
      case 'medium':
      default:
        return 64
    }
  })(size, $isMobileSize)

  $: height = width
  $: svgStyle = `width: ${width}px; height: ${height}px;`
  $: staticSrc = entity.avatar ? entity.avatar.staticUrl : ''
  $: src = flatMode ? staticSrc : (entity.avatar ? entity.avatar.url : '')
  $: showDefaultIcon = error || !entity.avatar
  $: nftReference = entity.avatar && entity.avatar.partOf
</script>

<div class="avatar-wrapper">
  {#if showDefaultIcon}
  <SvgIcon className={computedClass} style={svgStyle} href="#fa-user" />
  {:else if $autoplayGifs}
    <LazyImage
      ariaHidden="true"
      forceSize=true
      alt=""
      src={src}
      {width}
      {height}
      on:imgLoad="{ () => { loaded = true } }"
      on:imgLoadError="{ () => { error = true } }" />
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
      on:imgLoad="{ () => { loaded = true } }"
      on:imgLoadError="{ () => { error = true } }" />
  {/if}
  {#if showNFT && nftReference}
    <NFTMediaTag nft={nftReference}/>
  {/if}
</div>
<style>
  .avatar-wrapper {
    position: relative;
    font-size: 0;
  }

  :global(.avatar) {
    border-radius: 4px;
    background: var(--loading-bg);
  }

  :global(.avatar.loaded) {
    background: none;
  }

  :global(svg.avatar) {
    fill: var(--deemphasized-text-color);
  }
</style>

