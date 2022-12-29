<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/worlds/[worldId]/index.svelte'
  import { page } from '$app/stores';

 
  const params = $page.params
  params.newWorld = $page.url.searchParams.get('new') === '';
</script>

<Title name="{intl.worldProfile}" />

<LazyPage {pageComponent} {params} />