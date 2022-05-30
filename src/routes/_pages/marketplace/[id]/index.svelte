<script>
  import ListingPage from '../../../_components/marketplace/ListingPage.svelte'

  export let params;
</script>

{#key params.index}
    <ListingPage id={params.id} />
{/key}