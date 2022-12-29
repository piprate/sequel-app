<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/settings/instances/register.svelte'
  import { isUserLoggedIn } from '../../../_store/local'

  $: titleName = 'intl.signUp'
</script>

<Title name={titleName} settingsPage={true} />

  <LazyPage {pageComponent} />
