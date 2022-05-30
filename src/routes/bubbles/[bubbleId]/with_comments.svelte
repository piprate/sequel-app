<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/bubbles/[bubbleId]/with_comments.svelte'
  import { stores } from '@sapper/app';

  const { page } = stores();
</script>

<Title name="{intl.profileWithComments}" />

<LazyPage {pageComponent} params={$page.params} />