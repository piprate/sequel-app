<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/worlds/[worldId]/bubbles.svelte'
  import { page } from '$app/stores'
</script>

<Title name={intl.worldBubbles} />

<LazyPage {pageComponent} params={$page.params} />
