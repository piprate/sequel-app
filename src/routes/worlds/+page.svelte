<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/worlds/index.svelte'
</script>

<Title name="{intl.worlds}" />

<LazyPage {pageComponent} />
