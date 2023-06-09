<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/hotkeys.svelte'
</script>

<Title name={intl.hotkeys} settingsPage={true} />

<LazyPage {pageComponent} />
