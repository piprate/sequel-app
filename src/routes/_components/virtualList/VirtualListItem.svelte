<script>
  import { itemHeights, length, virtualListStore } from './virtualListStore'
  import { registerResizeListener, unregisterResizeListener } from '../../_utils/resize'
  import { mark, stop } from '../../_utils/marks'
  import { requestPostAnimationFrame } from '../../_utils/requestPostAnimationFrame'
  import { doubleRAF } from '../../_utils/doubleRAF'
  import { onMount } from "svelte";

  export let component;
  export let offset;
  export let props;
  export let key;
  export let index;

  let shown = false;

  $: shownBeforeRaf = $itemHeights[key] > 0;

  let node;

  function doRecalculateHeight () {
    // Recalculate immediately because this is done on-demand, e.g.
    // when clicking the "More" button on a spoiler.
    const rect = node.getBoundingClientRect()
    let _itemHeights = $itemHeights;
    _itemHeights[key] = rect.height
    virtualListStore.setForRealm({ itemHeights: _itemHeights })
  }

  // this RAF delay is necessary in order to get the fade-in animation
  // to consistently show
  $: (shownBeforeRaf => {
    doubleRAF(() => {
      shown = shownBeforeRaf;
    })
  })(shownBeforeRaf);

  onMount(() => {
    requestPostAnimationFrame(() => {
      if (!node || !key) {
        return
      }
      mark('VirtualListItem gBCR')
      const rect = node.getBoundingClientRect()
      stop('VirtualListItem gBCR')
      // update all item heights in one batch for better perf
      virtualListStore.batchUpdateForRealm('itemHeights', key, rect.height)
    })
    registerResizeListener(doRecalculateHeight)
    // // this RAF delay is necessary in order to get the fade-in animation
    // // to consistently show
    // this.observe('shownBeforeRaf', shownBeforeRaf => {
    //   doubleRAF(() => {
    //     shown = shownBeforeRaf;
    //   })
    // })
    return () => {
      unregisterResizeListener(doRecalculateHeight)
    }
  })
</script>

<div class="virtual-list-item list-item {shown ? 'shown' : ''}"
     aria-hidden={!shown}
     bind:this={node}
     style="top: {offset}px;" >
  <svelte:component this={component}
                    virtualProps={props}
                    virtualIndex={index}
                    virtualLength={$length}
                    on:recalculateHeight="{doRecalculateHeight}"/>
</div>
<style>
  .virtual-list-item {
    position: absolute;
    width: 100%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s linear;
    contain: content; /* see https://www.w3.org/TR/2018/CR-css-contain-1-20181108/#valdef-contain-content */
  }
  .virtual-list-item.shown {
    opacity: 1;
    pointer-events: auto;
  }
</style>