<script>
  import SvgIcon from './SvgIcon.svelte'
  import { goto } from '$app/navigation'
  import { classname } from '../_utils/classname'

  export let nft
  export let position = 'bottom'

  $: computedClass = classname('nft-buttons', position === 'bottom' ? 'bottom-right' : 'top-right')
  $: description = `NFT (source: ${nft.source}, token: ${nft.token})`

  function showToken(e) {
    if (nft.source === 'sequel') {
      e.preventDefault()
      e.stopPropagation()
      goto(`/tokens/digital-art/${nft.token}`)
    }
  }
</script>

<div class={computedClass}>
  <button class="nft-button" aria-label={description} title={description} on:click={showToken}>
    <SvgIcon className="nft-button-svg" href="#nft-diamond" />
  </button>
</div>

<style>
  .nft-buttons {
    position: absolute;
    z-index: 10;
    display: flex;
    justify-content: space-between;
  }

  .bottom-right {
    right: 0;
    bottom: 0;
  }

  .top-right {
    right: 0;
    top: 0;
  }

  .nft-button {
    padding: 2px;
    font-size: 0;
    background: var(--floating-button-bg);
    border: 1px solid var(--button-border);
  }

  :global(.nft-button-svg) {
    fill: var(--button-text);
    width: 10px;
    height: 10px;
  }
</style>
