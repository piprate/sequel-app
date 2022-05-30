<script>
  import { virtualListStore } from './virtualListStore'
  import { doubleRAF } from '../../_utils/doubleRAF'
  import { mark, stop } from '../../_utils/marks'
  import {onMount} from "svelte";

  export let component;
  export let virtualProps;
  export let shown;

  let fadedIn = false;
  let heightCalculated = false;
  let node;

  function doCalculateHeight() {
    if (heightCalculated) { // only need to calculate once, it never changes
      return
    }
    heightCalculated = true;
    requestAnimationFrame(() => {
      mark('VirtualListHeader gBCR')
      const rect = node.getBoundingClientRect()
      stop('VirtualListHeader gBCR')
      virtualListStore.setForRealm({ headerHeight: rect.height })
    })
  }

  $: {
    if (shown) {
      doCalculateHeight()
      doubleRAF(() => { fadedIn = true }); //  animate in
    } else {
      fadedIn = false;
    }
  }

  onMount(() => {
    // this.observe('shown', shown => {
    //   if (shown) {
    //     doCalculateHeight()
    //     doubleRAF(() => { fadedIn = true }); //  animate in
    //   } else {
    //     fadedIn = false;
    //   }
    // }, { init: false })
  })
</script>

<div class="virtual-list-header {shown ? 'shown' : ''} {fadedIn ? 'faded-in' : ''}"
     bind:this={node} >
  <svelte:component this={component} {virtualProps} />
</div>
<style>
  .virtual-list-header {
    position: absolute;
    top: 0;
    width: 100%;
    opacity: 0;
    z-index: 10;
    transition: none;
    display: none;
  }
  .virtual-list-header.shown {
    display: block;
    transition: opacity 0.2s linear;
  }
  .virtual-list-header.faded-in {
    opacity: 1;
  }
</style>