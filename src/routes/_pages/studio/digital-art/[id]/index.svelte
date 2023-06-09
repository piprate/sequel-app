<script>
  import DigitalArtPage from '../../../../_components/digitalart/DigitalArtPage.svelte'

  export let params
</script>

{#key params.index}
  <DigitalArtPage id={params.id} newDigitalArt={params.newDigitalArt} />
{/key}
