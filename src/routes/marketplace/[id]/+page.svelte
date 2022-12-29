<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/marketplace/[id]/index.svelte'
  import { page } from '$app/stores';

  const params = $page.params
</script>

<Title name="{intl.listing}" />

<LazyPage {pageComponent} {params} />