<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/settings/instances/[instanceName].svelte'
  import { page } from '$app/stores'
</script>

<Title name={$page.params.instanceName} settingsPage={true} />

<LazyPage {pageComponent} params={$page.params} />
