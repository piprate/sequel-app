<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/bubbles/index.svelte'
</script>

<Title name="{intl.yourBubblesTitle}" />

<LazyPage {pageComponent} />
