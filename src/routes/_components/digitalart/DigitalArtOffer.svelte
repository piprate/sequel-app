<script>
  import { importShowOfferDigitalArtDialog } from '../dialog/asyncDialogs/importShowOfferDigitalArtDialog'

  export let digitalArt

  async function openModal () {
    const showDialog = await importShowOfferDigitalArtDialog()
    showDialog(digitalArt)
  }
</script>

{#if digitalArt.offerCount < digitalArt.maxEdition || !digitalArt.offerCount}
  <div class="offer">
    <button class="primary" on:click={openModal}>OFFER</button>
  </div>
{/if}
  
<style>
    .offer {
        grid-area: offer;
    }

    button.primary {
        margin: 1rem 0;
    }
</style>