<script>
  import { times } from '../../_utils/lodash-lite'

  export let id
  export let label
  export let length
  export let className = ''

  $: ariaOwns = times(length, (index) => `radio-group-button-${id}-${index}`).join(' ')

  let radiogroup

  function onKeyDown(e) {
    // ArrowUp and ArrowDown should change the focused/checked radio button per
    // https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
    const { key, target } = e
    if (!['ArrowUp', 'ArrowDown'].includes(key)) {
      return
    }
    if (!target.classList.contains('radio-group-button')) {
      return
    }
    const buttons = Array.from(radiogroup.getElementsByClassName('radio-group-button'))
    const len = buttons.length
    const index = Math.max(
      0,
      buttons.findIndex((button) => button.getAttribute('aria-checked') === 'true')
    )
    const newIndex = (len + (index + (key === 'ArrowUp' ? -1 : 1))) % len // increment/decrement and wrap around
    buttons[newIndex].focus()
    buttons[newIndex].click()
    e.preventDefault()
    e.stopPropagation()
  }
</script>

<!-- Modeled after https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html -->
<div
  class="radio-group {className}"
  role="radiogroup"
  aria-label={label}
  aria-owns={ariaOwns}
  on:keydown={onKeyDown}
  bind:this={radiogroup}
>
  <slot />
</div>
