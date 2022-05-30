<script>
  import { classname } from '../_utils/classname'
  import SvgIcon from './SvgIcon.svelte'
  import {createEventDispatcher, onMount} from "svelte";

  export let label;
  export let href;
  export let clickListener = true;
  export let muted = false;
  export let disabled = false;
  export let svgClassName = undefined;
  export let elementId = '';
  export let pressable = false;
  export let pressed = false;
  export let pressedLabel = undefined;
  export let className = undefined;
  export let big = false;
  export let sameColorWhenPressed = false;
  export let ariaHidden = false;

  let node;
  let svg;

  $: computedClass = (classname(
          'icon-button',
          !pressable && 'not-pressable',
          pressed && 'pressed',
          big && 'big-icon',
          muted && 'muted-style',
          sameColorWhenPressed ? 'same-pressed' : 'not-same-pressed',
          className
  ));

  $: ariaLabel = ((pressable && pressed) ? pressedLabel : label);

  export function animate(animation) {
    svg.animate(animation);
  }

  const dispatch = createEventDispatcher();

  function onClick (e) {
    dispatch('click', e);
  }

  onMount(() => {
    if (clickListener) {
      //this.onClick = this.onClick.bind(this)
      node.addEventListener('click', onClick)
    }
    if (process.env.NODE_ENV !== 'production') {
      if (pressable && ((!pressedLabel || !label) || pressedLabel === label)) {
        throw new Error('pressable buttons should have a label and a pressedLabel different from each other')
      }
    }

    return () => {
      if (clickListener) {
        node.removeEventListener('click', onClick)
      }
    }
  });
</script>

<!-- Normally "pressable" icons would be toggle buttons, but to avoid having the titles and labels mismatched
     due to guidelines from http://w3c.github.io/aria-practices/#button , we just use normal buttons and change
     the aria-label instead. See discussion in: https://github.com/nolanlawson/pinafore/issues/1633 -->
<button id={elementId}
        type="button"
        title={ariaLabel}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ? 'true' : undefined}
        tabindex={ariaHidden ? '-1' : '0'}
        class={computedClass}
        {disabled}
        bind:this={node}
>
  <SvgIcon className="icon-button-svg {svgClassName || ''}" bind:this={svg} {href} />
</button>
<style>
  .icon-button {
    padding: 6px 10px;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }

  :global(.icon-button-svg) {
    width: 24px;
    height: 24px;
    fill: var(--action-button-fill-color);
    pointer-events: none; /* hack for Edge */
  }

  :global(.icon-button.big-icon .icon-button-svg) {
    width: 32px;
    height: 32px;
  }

  /*
   * regular styles
   */

  :global(.icon-button:hover .icon-button-svg) {
    fill: var(--action-button-fill-color-hover);
  }

  :global(.icon-button.not-pressable:active .icon-button-svg,
  .icon-button.same-pressed:active .icon-button-svg) {
    fill: var(--action-button-fill-color-active);
  }

  :global(.icon-button.pressed.not-same-pressed .icon-button-svg) {
    fill: var(--action-button-fill-color-pressed);
  }

  :global(.icon-button.pressed.not-same-pressed:hover .icon-button-svg) {
    fill: var(--action-button-fill-color-pressed-hover);
  }

  :global(.icon-button.pressed.not-same-pressed:active .icon-button-svg) {
    fill: var(--action-button-fill-color-pressed-active);
  }

  /*
   * muted
   */

  :global(.icon-button.muted-style .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color);
  }

  :global(.icon-button.muted-style:hover .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color-hover);
  }

  :global(.icon-button.muted-style.not-pressable:active .icon-button-svg,
  .icon-button.muted-style.same-pressed:active .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color-active);
  }

  :global(.icon-button.muted-style.pressed.not-same-pressed .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color-pressed);
  }

  :global(.icon-button.muted-style.pressed.not-same-pressed:hover .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color-pressed-hover);
  }

  :global(.icon-button.muted-style.pressed.not-same-pressed:active .icon-button-svg) {
    fill: var(--action-button-deemphasized-fill-color-pressed-active);
  }

</style>
