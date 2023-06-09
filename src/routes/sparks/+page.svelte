<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/sparks/index.svelte'
</script>

<Title name={intl.yourSparksTitle} />

<LazyPage {pageComponent} />
