<script>
  import Title from '../../../../_components/Title.svelte'
  import LazyPage from '../../../../_components/LazyPage.svelte'
  import pageComponent from '../../../../_pages/marketplace/releases/[id]/edit.svelte'
  import { page } from '$app/stores'
</script>

<Title name={intl.editRelease} />

<LazyPage {pageComponent} params={$page.params} />
