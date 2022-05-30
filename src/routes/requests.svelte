<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/requests.svelte'
</script>

<Title name="{intl.followRequests}" />

<LazyPage {pageComponent} />