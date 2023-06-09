<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/settings/instances/visit.svelte'
</script>

<Title name={'intl.visitorTitle'} settingsPage={true} />

<LazyPage {pageComponent} />
