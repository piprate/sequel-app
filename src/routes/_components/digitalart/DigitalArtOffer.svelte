<script>
  import { importShowOfferDigitalArtDialog } from '../dialog/asyncDialogs/importShowOfferDigitalArtDialog'

  export let digitalArt

  async function openModal () {
    const showDialog = await importShowOfferDigitalArtDialog()
    showDialog(digitalArt)
  }
</script>

<div class="offer">
    <button class="primary" on:click={openModal} disabled={!!digitalArt.sealRecord}>OFFER</button>
</div>
  
<style>
    .offer {
        grid-area: offer;
    }

    button.primary {
        margin: 1rem 0;
    }
</style>