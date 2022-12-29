<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/subscriptions/manage.svelte'
</script>

<Title name="{intl.manageSubscriptions}" />

<LazyPage {pageComponent} />
