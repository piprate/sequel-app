<script>
  import SparksListPage from '../../_components/SparksListPage.svelte'
  import SparkBrowserFilter from '../../_components/spark/SparkBrowserFilter.svelte'
  import { currentInstance, isUserLoggedIn } from '../../_store/local'
  import { accessToken } from '../../_store/instance'
  import { getSparkList } from '../../_api/sparks'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: sparksFetcher = () => ($isUserLoggedIn ? getSparkList($currentInstance, $accessToken) : [])
</script>

{#if $isUserLoggedIn}
  <SparkBrowserFilter filter="explore" />
  <SparksListPage {sparksFetcher} />
{/if}
