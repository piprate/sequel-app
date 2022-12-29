<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/marketplace/history.svelte'
</script>

<Title name="{intl.marketplaceHistory}" />

  <LazyPage {pageComponent} />
