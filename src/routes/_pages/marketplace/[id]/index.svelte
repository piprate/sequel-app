<script>
  import ListingPage from '../../../_components/marketplace/ListingPage.svelte'

  export let params
</script>

{#key params.id}
  <ListingPage id={params.id} />
{/key}
