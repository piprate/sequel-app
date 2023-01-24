<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/bubbles/[bubbleId]/index.svelte'
  import { page } from '$app/stores'
  import { observedBubble } from '../../_store/local'

  const params = $page.params
  params.newBubble = $page.url.searchParams.get('new') === ''

  $: bubbleName = $observedBubble?.name || 'intl.bubbleProfile'
</script>

<Title name={bubbleName} />

<LazyPage {pageComponent} {params} />