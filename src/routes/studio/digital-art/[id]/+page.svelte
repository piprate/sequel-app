<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/studio/digital-art/[id]/index.svelte'
  import { page } from '$app/stores'

  
</script>

<Title name="{intl.tokenPageTitle}" />

<LazyPage {pageComponent} params={$page.params} />