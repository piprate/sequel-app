<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/worlds/[worldId]/index.svelte'
  import { page } from '$app/stores'
  import { observedWorld } from '../../_store/local'

  $: params = {
    worldId: $page.params.worldId,
    newWorld: $page.url.searchParams.get('new') === ''
  }
  $: worldName = $observedWorld?.name || 'intl.worldProfile'
</script>

<Title name={worldName} />

<LazyPage {pageComponent} {params} />
