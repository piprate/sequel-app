<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/tags/[tagName].svelte'
  import { stores } from '@sapper/app';

  const { page } = stores();
</script>

<Title name="{intl.hashtag}" />

<LazyPage {pageComponent} params={$page.params} />