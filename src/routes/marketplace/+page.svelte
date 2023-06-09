<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/marketplace/index.svelte'
</script>

<Title name={intl.marketplace} />

<LazyPage {pageComponent} />
