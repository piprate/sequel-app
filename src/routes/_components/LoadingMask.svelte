<script>
  import LoadingSpinner from './LoadingSpinner.svelte'
  import { logInToInstanceLoading } from '../_store/local'

  $: shown = $logInToInstanceLoading
</script>

<div class="loading-mask-container {shown ? 'loading-mask-container-shown' : ''}">
  {#if shown}
    <div class="loading-mask">
      <LoadingSpinner maskStyle="true" />
    </div>
  {/if}
</div>

<style>
  .loading-mask-container {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    z-index: 100;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s linear;
  }
  .loading-mask-container.loading-mask-container-shown {
    pointer-events: auto;
    opacity: 0.6;
  }
  .loading-mask {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mask-bg);
  }
</style>
