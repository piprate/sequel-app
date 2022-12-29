<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/bubbles/[bubbleId]/edit.svelte'
  import { page } from '$app/stores';
</script>

<Title name="{intl.editBubble}" />

<LazyPage {pageComponent} params={$page.params} />
