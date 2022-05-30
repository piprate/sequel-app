<script>
  import SparkProfilePage from '../../../_components/spark/SparkProfilePage.svelte'

  export let params
</script>

<SparkProfilePage sparkId={params.sparkId} filter="with_comments" />
