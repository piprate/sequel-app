<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/lists/[listId].svelte'
  import { page } from '$app/stores'
</script>

<Title name={intl.list} />

<LazyPage {pageComponent} params={$page.params} />
