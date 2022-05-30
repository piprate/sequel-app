<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/local.svelte'
</script>

<Title name="{intl.local}" />

<LazyPage {pageComponent} />