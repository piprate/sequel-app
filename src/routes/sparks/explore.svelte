<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/sparks/explore.svelte'
</script>

<Title name="{intl.sparkExploreTitle}" />

<LazyPage {pageComponent} />
