<script>
  import SparkProfilePage from '../../../_components/spark/SparkProfilePage.svelte'

  export let params
  export let withComments = false
</script>

<SparkProfilePage sparkId={params.sparkId} filter={withComments ? 'with_comments/reader_mode' : 'reader_mode'} />
