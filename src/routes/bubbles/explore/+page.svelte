<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/bubbles/explore.svelte'
</script>

<Title name={intl.bubbleExploreTitle} />

<LazyPage {pageComponent} />
