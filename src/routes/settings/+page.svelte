<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/settings/index.svelte'
</script>

<Title name={intl.settings} settingsPage={true} />

<LazyPage {pageComponent} />
