<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/studio/index.svelte'
</script>

<Title name={intl.studio} />

<LazyPage {pageComponent} />
