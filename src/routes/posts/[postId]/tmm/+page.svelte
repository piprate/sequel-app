<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/posts/[postId]/tmm.svelte'
  import { page } from '$app/stores'
</script>

<Title name={intl.tellMeMores} />

<LazyPage {pageComponent} params={$page.params} />
