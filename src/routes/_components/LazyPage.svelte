<script>
  import { onMount } from 'svelte';
  import { inNode } from '../_utils/browserOrNode';
  import { doubleRAF } from '../_utils/doubleRAF'
  // On the very first page load, avoid doing a "reveal" because
  // it leads to a flash between when the SSR is shown, the two frame we hide it,
  // and then when we show it again.
  //
  // We only really need LazyPage behavior when the user is clicking around
  // after the page has loaded, to improve input responsiveness.
  let firstTime = true;

  export let pageComponent;
  export let params = undefined;

  let revealed = inNode() || firstTime;

  onMount(() => {
    firstTime = false
    // Yes, triple raf. This is to ensure the NavItem animation plays before we
    // start rendering the new page.
    doubleRAF(() => requestAnimationFrame(() => { revealed = true; }));
  });
</script>

{#if revealed}
  <svelte:component this={pageComponent} {params} />
{/if}

