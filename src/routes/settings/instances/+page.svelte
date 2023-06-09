<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/instances/index.svelte'
</script>

<Title name={intl.instances} settingsPage={true} />

<LazyPage {pageComponent} />
