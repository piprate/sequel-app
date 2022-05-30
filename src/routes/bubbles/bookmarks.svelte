<script>
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/bubbles/bookmarks.svelte'
</script>

<Title name="{intl.bubbleBookmarksTitle}" />

<LazyPage {pageComponent} />
