<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/favorites.svelte'
</script>

<Title name="{intl.favorites}" />

<LazyPage {pageComponent} />