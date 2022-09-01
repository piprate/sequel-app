<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/marketplace/release/[id]/index.svelte'
  import { stores } from '@sapper/app'

  const { page } = stores()
  const params = $page.params
</script>

<Title name="{intl.release}" />

<LazyPage {pageComponent} {params} />