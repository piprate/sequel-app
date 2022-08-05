<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/tokens/digital-art/[id]/index.svelte'
  import { stores } from '@sapper/app'

  const { page } = stores()
</script>

<Title name="{intl.tokenPageTitle}" />

<LazyPage {pageComponent} params={$page.params} />