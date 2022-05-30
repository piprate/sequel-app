<script>
  import { autoplayGifs, isMobileSize } from '../_store/local'
  import NonAutoplayImg from './NonAutoplayImg.svelte'
  import { classname } from '../_utils/classname'
  import LazyImage from './LazyImage.svelte'
  import SvgIcon from './SvgIcon.svelte'

  export let account;
  export let size = 'medium';
  export let isLink = false;

  let className = undefined;
  let loaded = false;
  let error = undefined;

  $: computedClass = classname(
          'avatar',
          className,
          loaded && 'loaded'
  );

  $: width = ((size, isMobileSize) => {
    switch (size) {
      case 'extra-small':
        return 24
      case 'small':
        return 48
      case 'big':
        return isMobileSize ? 80 : 100
      case 'medium':
      default:
        return 64
    }
  })(size, $isMobileSize);

  $: height = width;
  // svgStyle: ({ width, height }) => `width: ${width}px; height: ${height}px;`
  $: svgStyle = `width: ${width}px; height: ${height}px;`
</script>

{#if error}
<SvgIcon className={computedClass} style={svgStyle} href="#fa-user" />
{:else if $autoplayGifs}
  <LazyImage
    ariaHidden="true"
    forceSize=true
    alt=""
    src={account.avatar}
    {width}
    {height}
    on:imgLoad="{ () => { loaded = true } }"
    on:imgLoadError="{ () => { error = true } }" />
{:else}
  <NonAutoplayImg
    className={computedClass}
    ariaHidden="true"
    alt=""
    src={account.avatar}
    staticSrc={account.avatar_static}
    {width}
    {height}
    {isLink}
    on:imgLoad="{ () => { loaded = true } }"
    on:imgLoadError="{ () => { error = true } }" />
{/if}
<style>
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

