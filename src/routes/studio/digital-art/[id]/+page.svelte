<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/studio/digital-art/[id]/index.svelte'
  import { page } from '$app/stores'
  import { observedDigitalArt } from 'src/routes/_store/local'

  $: digitalArtName = $observedDigitalArt?.name || 'intl.tokenPageTitle'
</script>

<Title name={digitalArtName} />

<LazyPage {pageComponent} params={$page.params} />