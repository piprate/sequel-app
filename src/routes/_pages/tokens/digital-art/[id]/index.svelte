<script>
  import DigitalArtTokenPage from '../../../../_components/digitalart/DigitalArtTokenPage.svelte'

  export let params
</script>

{#key params.index}
  <DigitalArtTokenPage id={params.id} />
{/key}
