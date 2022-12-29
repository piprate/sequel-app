<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/flow.svelte'
  import { isUserLoggedIn } from '../../_store/local'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { page } from '$app/stores'

  
  const params = $page.params
  params.newUser = $page.url.searchParams.get('new') === ''
</script>

<Title name="{intl.connectWithFlow}" settingsPage={true} />

{#if $isUserLoggedIn}
  <LazyPage {pageComponent} {params} />
{:else}
  <RestrictedPageWarning />
{/if}