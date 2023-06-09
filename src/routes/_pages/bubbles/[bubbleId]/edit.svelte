<script>
  import BubbleEdit from '../../../_components/bubble/BubbleEdit.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { onMount } from 'svelte'
  import { clearComposeData, isAuthenticated, setComposeData } from '../../../_store/local'
  import { loadBubble } from '../../../_actions/bubbles'
  import { setComposeImage } from '../../../_actions/media'

  export let params

  // suppress warnings
  const intl = {}

  let realm = `bubble/${params.bubbleId}`
  let template

  let world

  onMount(async () => {
    const bubble = await loadBubble(params.bubbleId)
    console.log('LOADED BUBBLE', bubble)

    template = {
      name: bubble.name,
      handle: bubble.handle,
      world: bubble.world,
      summary: bubble.summary,
      membershipMode: bubble.membershipMode,
      observerMode: bubble.observerMode,
      writerMode: bubble.writerMode,
      federationMode: bubble.federationMode || 'disabled'
    }

    world = bubble.worldRef

    clearComposeData(realm)

    if (bubble.avatar) {
      setComposeImage(realm, bubble, 'avatar')
      setComposeData(realm, { avatarPresent: true })
    }

    if (bubble.header) {
      setComposeImage(realm, bubble, 'header')
      setComposeData(realm, { headerPresent: true })
    }
  })
</script>

<DynamicPageBanner title={intl.editBubble} />
{#if $isAuthenticated}
  {#if template}
    <BubbleEdit {realm} newBubble={false} bubbleId={params.bubbleId} {template} {world} />
  {/if}
{:else}
  <RestrictedPageWarning />
{/if}
