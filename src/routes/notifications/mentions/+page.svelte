<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/notifications/mentions.svelte'
</script>

<Title name="{intl.notifications}" />

<LazyPage {pageComponent} />