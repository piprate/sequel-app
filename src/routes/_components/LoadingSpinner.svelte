<script>
  import SvgIcon from './SvgIcon.svelte'

  export let size = 64
  export let maskStyle = false
  export let animate = true
</script>

<SvgIcon
  className="loading-spinner-icon {animate ? 'spin' : ''} {maskStyle ? 'mask-style' : ''}"
  style="width: {size}px; height: {size}px;"
  href="#fa-spinner"
  ariaLabel={intl.loading}
/>

<style>
  :global(.loading-spinner-icon) {
    fill: var(--svg-fill);
  }

  :global(.loading-spinner-icon.mask-style) {
    fill: var(--mask-svg-fill);
  }
</style>
