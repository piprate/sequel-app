<script>
  import { classname } from '../../_utils/classname'
  import SvgIcon from '../SvgIcon.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let bubble
  export let className = undefined
  export let normalIconColor = false
  export let ariaLabel = ''

  $: bubbleId = unwrap(bubble.id)
  $: bubbleName = (bubble && bubble.name) || ''
  $: computedClass = (classname(
    'location',
    className,
    'location-with-icon',
    normalIconColor && 'normal-icon-color'
  ))
</script>
<div class="post-location">
    <a href='/bubbles/{bubbleId}' aria-label={ariaLabel} class={computedClass}>
        <SvgIcon className="location-svg" href="#fa-map-marker" />
        {bubbleName}
    </a>
</div>
<style>
    .post-location {
        grid-area: location;
        display: grid;
        grid-template-columns: minmax(0, max-content) repeat(3, max-content);
        grid-gap: 20px;
        align-items: center;
        justify-content: left;
        margin: 0 5px 10px;
    }
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