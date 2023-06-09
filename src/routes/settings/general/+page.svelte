<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/general.svelte'
</script>

<Title name={intl.generalSettings} settingsPage={true} />

<LazyPage {pageComponent} />
