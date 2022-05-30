<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/muted.svelte'
</script>

<Title name="{intl.mutedUsers}" />

<LazyPage {pageComponent} />