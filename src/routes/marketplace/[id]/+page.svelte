<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/marketplace/[id]/index.svelte'
  import { page } from '$app/stores'
  import { observedListing } from '../../_store/local'

  $: marketplaceName = $observedListing?.object.name || 'intl.listing'
</script>

<Title name={marketplaceName} />

<LazyPage {pageComponent} params={$page.params} />