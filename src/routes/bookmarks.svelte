<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/bookmarks.svelte'
</script>

<Title name="{intl.bookmarks}" />

<LazyPage {pageComponent} />
