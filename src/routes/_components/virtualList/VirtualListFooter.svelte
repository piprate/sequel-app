<script>
  import { heightWithoutFooter, virtualListStore } from './virtualListStore'
  import { mark, stop } from '../../_utils/marks'
  import { onMount } from 'svelte'

  export let component

  let node

  onMount(() => {
    requestAnimationFrame(() => {
      if (!node) {
        return
      }

      mark('VirtualListFooter gBCR')
      const rect = node.getBoundingClientRect()
      stop('VirtualListFooter gBCR')
      virtualListStore.setForRealm({ footerHeight: rect.height })
    })
  })
</script>

<div class="virtual-list-footer" bind:this={node} style="transform: translateY({$heightWithoutFooter}px);">
  <svelte:component this={component} />
</div>

<style>
  .virtual-list-footer {
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
