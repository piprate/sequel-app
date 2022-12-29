<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/subscriptions/index.svelte'
</script>

<Title name="{intl.subscriptionsTimeline}" />

<LazyPage {pageComponent} />
