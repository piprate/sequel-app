<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/worlds/explore.svelte'
</script>

<Title name="{intl.worldExploreTitle}" />

<LazyPage {pageComponent} />
