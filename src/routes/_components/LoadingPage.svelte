<script>
  import LoadingSpinner from './LoadingSpinner.svelte'
  import { onMount } from 'svelte'

  const SPINNER_DELAY = 700

  let shown = false

  onMount(() => {
    setTimeout(() => {
      shown = true
    }, SPINNER_DELAY)
  })
</script>

<div class="loading-page {shown ? '' : 'hidden'}">
  <LoadingSpinner />
</div>

<style>
  .loading-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition: opacity 0.25s linear;
  }
</style>
