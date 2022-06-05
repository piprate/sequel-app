<script>
  import { loadSpark } from '../../../_actions/sparks'
  import SparkEdit from '../../../_components/spark/SparkEdit.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { onMount } from 'svelte'
  import { clearComposeData, isAuthenticated, setComposeData } from '../../../_store/local'
  import { setComposeImage } from '../../../_actions/media'

  export let params

  // suppress warnings
  const intl = {}

  let realm = `spark/${params.sparkId}`
  let template

  let homeWorld

  onMount(async () => {
    const spark = await loadSpark(params.sparkId)
    console.log('LOADED SPARK', spark)

    template = {
      name: spark.name,
      handle: spark.handle,
      homeWorld: spark.homeWorld,
      summary: spark.summary,
    }

    homeWorld = spark.homeWorldRef

    clearComposeData(realm)

    if (spark.avatar) {
      setComposeImage(realm, spark, 'avatar')
      setComposeData(realm, { avatarPresent: true })
    }

    if (spark.header) {
      setComposeImage(realm, spark, 'header')
      setComposeData(realm, { headerPresent: true })
    }
  })
</script>
<DynamicPageBanner title="{intl.editSpark}" />
{#if $isAuthenticated }
    {#if template}
        <SparkEdit {realm} newSpark={false} sparkId={params.sparkId} {template} {homeWorld} />
    {/if}
{:else}
    <RestrictedPageWarning />
{/if}