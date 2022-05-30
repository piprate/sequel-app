<script>
  import SparkProfilePage from '../../../_components/spark/SparkProfilePage.svelte'

  export let params;
</script>

{#key params.sparkId}
    <SparkProfilePage sparkId={params.sparkId} newSpark={params.newSpark} filter="" />
{/key}