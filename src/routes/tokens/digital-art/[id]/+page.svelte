<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/tokens/digital-art/[id]/index.svelte'
  import { page } from '$app/stores'
  import { observedDigitalArt } from '../../../_store/local'

  $: tokenName = $observedDigitalArt?.name || 'intl.tokenPageTitle'

</script>

<Title name={tokenName} />

<LazyPage {pageComponent} params={$page.params} />