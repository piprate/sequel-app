<script>
  import { classname } from '../_utils/classname'
  import SvgIcon from './SvgIcon.svelte'

  export let href
  export let className = undefined
  export let normalIconColor = false
  export let ariaLabel = ''
  export let showIcon = false

  $: computedClass = classname(
    'external-link',
    className,
    showIcon && 'external-link-with-icon',
    normalIconColor && 'normal-icon-color'
  )
</script>

<a rel="nofollow noopener" target="_blank" {href} aria-label={ariaLabel} class={computedClass}>
  <slot />{#if showIcon}
    <SvgIcon className="external-link-svg" href="#fa-external-link" />
  {/if}</a
>

<style>
  .external-link-with-icon {
    display: inline-flex;
    align-items: center;
  }
  :global(.external-link-with-icon .external-link-svg) {
    margin-left: 4px;
    width: 14px;
    height: 14px;
    fill: var(--deemphasized-text-color);
  }
  :global(.external-link-with-icon.normal-icon-color .external-link-svg) {
    fill: var(--body-text-color);
  }
</style>
