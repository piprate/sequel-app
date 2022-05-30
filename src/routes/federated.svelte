<script>
  import Title from './_components/Title.svelte'
  import LazyPage from './_components/LazyPage.svelte'
  import pageComponent from './_pages/federated.svelte'
</script>

<Title name="{intl.federated}" />

<LazyPage {pageComponent} />