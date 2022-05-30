<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/settings/wellness.svelte'
</script>

<Title name="{intl.wellnessSettings}" settingsPage={true} />

  <LazyPage {pageComponent} />

