<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/sparks/[sparkId]/index.svelte'
  import { page } from '$app/stores'
  import { observedSpark } from '../../_store/local'

  $: params = {
    sparkId: $page.params.sparkId,
    newSpark: $page.url.searchParams.get('new') === ''
  }
  $: sparkName = $observedSpark?.name || 'intl.profile'
</script>

<Title name={sparkName} />

<LazyPage {pageComponent} {params} />