<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/sparks/[sparkId]/index.svelte'
  import { page } from '$app/stores';

 
  const params = $page.params
  params.newSpark = $page.url.searchParams.get('new') === '';
</script>

<Title name="{intl.profile}" />

<LazyPage {pageComponent} {params} />