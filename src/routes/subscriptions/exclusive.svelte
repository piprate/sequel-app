<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/subscriptions/exclusive.svelte'
</script>

<Title name="{intl.exclusiveTimeline}" />

<LazyPage {pageComponent} />
