<!-- Simple tooltip styled to look like an abbr.
     Modeled after https://github.com/nico3333fr/van11y-accessible-simple-tooltip-aria
-->
<script context="module">
  import Shortcut from './shortcut/Shortcut.svelte'

  let counter = 0;
</script>
<script>
  export let text;
  export let tooltipText;

  let shown = false;
  let mouseover = false;

  let id = ++counter;

  function toggle (e) {
    e.preventDefault()
    e.stopPropagation()
    if (!mouseover) {
      shown = !shown
    }
  }

  function onKeydown (e) {
    if (e.keyCode === 32 || e.keyCode === 13) { // enter or space
      toggle(e)
    }
  }

  function onMouseOver() {
    shown = true;
    mouseover = true;
  }

  function onMouseLeave() {
    shown = false;
    mouseover = false;
  }

  function dismiss () {
    shown = false;
  }
</script>

<span class="tooltip-button"
      aria-describedby="tooltip-{id}"
      role="button"
      tabindex="0"
      on:mouseover="{onMouseOver}"
      on:focus="{onMouseOver}"
      on:mouseleave="{onMouseLeave}"
      on:click="{toggle}"
      on:keydown="{onKeydown}"
>
  {text}
</span>
<span id="tooltip-{id}"
      class="tooltip {shown ? 'shown' : ''}"
      role="tooltip"
      aria-hidden={!shown}
>
  {tooltipText}
</span>
<Shortcut scope="global" key="Escape" on:pressed="{dismiss}" />
<style>
  .tooltip-button {
    border-bottom: 1px dotted;
  }
  .tooltip {
    display: none;
    position: absolute;
    background: var(--tooltip-bg);
    color: var(--tooltip-color);
    padding: 5px 10px;
    font-size: 0.9em;
    border-radius: 4px;
  }
  .tooltip.shown {
    display: inline-block;
  }

  @media (max-width: 767px) {
    .tooltip {
      left: 0;
      transform: translateY(calc(-100% - 5px));
    }
  }

</style>

