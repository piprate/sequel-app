<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/bubbles/new.svelte'
</script>

<Title name="{intl.newBubble}" />

  <LazyPage {pageComponent} />
