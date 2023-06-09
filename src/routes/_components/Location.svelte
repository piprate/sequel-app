<script>
  import { classname } from '../_utils/classname'
  import SvgIcon from './SvgIcon.svelte'
  import { unwrap } from '../_utils/mapper'

  export let world
  export let className = undefined
  export let normalIconColor = false
  export let ariaLabel = ''

  $: worldId = unwrap(world.id)
  $: worldName = (world && world.name) || ''
  $: computedClass = classname('location', className, 'location-with-icon', normalIconColor && 'normal-icon-color')
</script>

<a href="/worlds/{worldId}" aria-label={ariaLabel} class={computedClass}>
  <SvgIcon className="location-svg" href="#fa-map-marker" />
  {worldName}
</a>

<style>
  .location-with-icon {
    display: inline-flex;
    align-items: center;
  }
  :global(.location-with-icon .location-svg) {
    margin-left: 0px;
    margin-right: 4px;
    width: 14px;
    height: 14px;
    fill: var(--deemphasized-text-color);
  }
  :global(.location-with-icon.normal-icon-color .location-svg) {
    fill: var(--body-text-color);
  }
</style>
