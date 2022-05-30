<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/worlds/[worldId]/index.svelte'
  import { stores } from '@sapper/app';

  const { page } = stores();
  const params = $page.params
  params.newWorld = $page.query.new === '';
</script>

<Title name="{intl.worldProfile}" />

<LazyPage {pageComponent} {params} />