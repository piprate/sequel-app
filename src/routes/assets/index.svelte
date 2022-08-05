<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/assets/index.svelte'
</script>

<Title name="{intl.assetsPageTitle}" />

  <LazyPage {pageComponent} />
