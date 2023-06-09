<script>
  import SparkEdit from '../../_components/spark/SparkEdit.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}
</script>

<DynamicPageBanner title={intl.newSpark} />
<SparkEdit realm="new_spark" newSpark={true} />
