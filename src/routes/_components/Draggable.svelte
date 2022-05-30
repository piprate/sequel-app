<script>
  import { throttleTimer } from '../_utils/throttleTimer'
  import { pointerUp, pointerDown, pointerLeave, pointerMove } from '../_utils/pointerEvents'
  import { requestPostAnimationFrame } from '../_utils/requestPostAnimationFrame'
  import { classname } from '../_utils/classname'
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  // ensure DOM writes only happen once after a rAF
  const updateIndicatorStyle = throttleTimer(requestAnimationFrame)
  const updateIndicatorClass = throttleTimer(requestAnimationFrame)
  const updateDraggableClass = throttleTimer(requestAnimationFrame)

  // ensure DOM reads only happen once after a rPAF
  const calculateGBCR = throttleTimer(requestPostAnimationFrame)

  const clamp = x => Math.max(0, Math.min(1, x))

  let dragging = false;
  let draggableClass = '';
  let draggableClassAfterRaf = '';
  let indicatorClass = '';
  let computedIndicatorClassAfterRaf = '';
  let x = 0;
  let y = 0;
  let indicatorWidth = 0;
  let indicatorHeight = 0;
  let indicatorStyleAfterRaf = ''
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  $: indicatorStyle = (
          `left: calc(${x * 100}% - ${indicatorWidth / 2}px); top: calc(${y * 100}% - ${indicatorHeight / 2}px);`
  );
  $: computedIndicatorClass = classname(dragging && 'grabbing', indicatorClass);

  let area;
  let indicator;

  function onPointerDown (e) {
    console.log('Draggable: onPointerDown')
    const rect = indicator.getBoundingClientRect()
    console.log('Draggable: e.clientX', e.clientX)
    console.log('Draggable: e.clientY', e.clientY)
    dragging = true;
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  }

  function onPointerMove (e) {
    console.log('Draggable: onPointerMove')
    if (dragging) {
      console.log('Draggable: dragging')
      calculateGBCR(() => {
        const rect = area.getBoundingClientRect()
        const offsetX = dragOffsetX - (indicatorWidth / 2)
        const offsetY = dragOffsetY - (indicatorHeight / 2)
        x = clamp((e.clientX - rect.left - offsetX) / rect.width)
        y = clamp((e.clientY - rect.top - offsetY) / rect.height)
      })
    }
  }

  function onPointerUp (e) {
    console.log('Draggable: onPointerUp')
    dragging = false;
  }

  function onPointerLeave (e) {
    console.log('Draggable: onPointerLeave')
    dragging = false;
  }

  function onClick (e) {
    console.log('Draggable: onClick')
    console.log('Draggable: target classList', e.target.classList)
    console.log('Draggable: currentTarget classList', e.currentTarget.classList)
    if (!e.target.classList.contains('draggable-indicator')) {
      console.log('Draggable: onClick handled')
      const rect = area.getBoundingClientRect()
      x = clamp((e.clientX - rect.left) / rect.width)
      y = clamp((e.clientY - rect.top) / rect.height)
      dispatch('change', { x, y })
    }
  }

  // FIXME reactives below are enabled in onMount in Pinafore.

  $: (dragging => {
    if (dragging) {
      dispatch('dragStart')
    } else {
      dispatch('dragEnd')
      dispatch('change', { x, y })
    }
  })(dragging);

  $: ((indicatorStyle) => updateIndicatorStyle(() => {
    indicatorStyleAfterRaf = indicatorStyle;
  }))(indicatorStyle);

  $: ((computedIndicatorClass) => updateIndicatorClass(() => {
    computedIndicatorClassAfterRaf = computedIndicatorClass;
  }))(computedIndicatorClass);

  $: ((draggableClass) => updateDraggableClass(() => {
    draggableClassAfterRaf = draggableClass;
  }))(draggableClass);

  onMount(() => {
    // this.observe('dragging', dragging => {
    //   if (dragging) {
    //     dispatch('dragStart')
    //   } else {
    //     dispatch('dragEnd')
    //     dispatch('change', { x, y })
    //   }
    // }, { init: false })
    // this.observe('indicatorStyle', () => {
    //   updateIndicatorStyle(() => {
    //     indicatorStyleAfterRaf = indicatorStyle;
    //   })
    // })
    // this.observe('computedIndicatorClass', () => {
    //   updateIndicatorClass(() => {
    //     computedIndicatorClassAfterRaf = computedIndicatorClass;
    //   })
    // })
    // this.observe('draggableClass', () => {
    //   updateDraggableClass(() => {
    //     draggableClassAfterRaf = draggableClass;
    //   })
    // })
  });
</script>

<div class="draggable-area {draggableClassAfterRaf}"
     on:pointerMove="{onPointerMove}"
     on:pointerLeave="{onPointerLeave}"
     on:pointerUp="{onPointerUp}"
     on:click="{onClick}"
     bind:this={area}
>
  <div class="draggable-indicator {computedIndicatorClassAfterRaf}"
       style={indicatorStyleAfterRaf}
       on:pointerDown="{onPointerDown}"
       bind:this={indicator}
  >
    <div class="draggable-indicator-inner">
      <slot></slot>
    </div>
  </div>
</div>
<style>
  .draggable-area {
    position: relative;
    touch-action: none;
    cursor: pointer;
  }
  .draggable-indicator {
    position: absolute;
    cursor: grab;
  }
  .draggable-indicator.grabbing {
    cursor: grabbing;
  }
  .draggable-indicator-inner {
    pointer-events: none;
    display: flex;
  }
</style>