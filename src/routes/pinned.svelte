<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/pinned.svelte'
</script>

<Title name="{intl.pinnedStatuses}" />

<LazyPage {pageComponent} />