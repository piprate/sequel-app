<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/about.svelte'
</script>

<Title name={intl.about} settingsPage={true} />

<LazyPage {pageComponent} />
