<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/sparks/new.svelte'
</script>

<Title name={intl.newSpark} />

<LazyPage {pageComponent} />
