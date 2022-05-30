<script>
  import TimelinePage from '../TimelinePage.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedBubble, observedBubbleRelationship } from '../../_store/local.js'
  import { currentSpark, currentSparkId } from '../../_store/instance.js'
  import HiddenFromSSR from '../HiddenFromSSR.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import LazyComposeBox from '../compose/LazyComposeBox.svelte'
  import { clearBubbleProfileAndRelationship, updateBubbleProfileAndRelationship } from '../../_actions/bubbles'
  import BubbleProfile from './BubbleProfile.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import InfoAside from '../InfoAside.svelte'
  import { updateMembership } from '../../_actions/bubble/membership'

  export let bubbleId
  export let newBubble = false
  export let filter

  $: bubble = $observedBubble
  $: relationship = $observedBubbleRelationship
  $: bubbleName = (bubble && bubble.name) || ''
  $: timeline = `bubble/${bubbleId}` + (filter ? `/${filter}` : '')
  $: ariaTitle = formatIntl('intl.homePageForBubble', { bubble: bubbleName })
  $: hidePage = !(relationship && (relationship.status === 'active'))
  $: canPost = (() => {
    if ($currentSpark && bubble && relationship) {
      switch (relationship.memberType) {
        case 'owner':
        case 'moderator':
          return true
        case 'writer':
          return bubble.writerMode !== 'none'
      }
    }
    return false
  })()
  $: canJoin = bubble && relationship && relationship.status !== 'active' && bubble.membershipMode !== 'invite_only'
  $: showReadWarning = canJoin && bubble.observerMode === 'members'
  $: showPostWarning = canJoin && !canPost && bubble.writerMode !== 'none'
  $: showInvitation = showReadWarning || showPostWarning
  $: invitationMessage = showReadWarning ? 'intl.inviteToRead' : 'intl.inviteToPost'

  let loading = true
  let notFound = false

  async function onJoinButtonClick (e) {
    e.stopPropagation()
    await updateMembership(bubbleId, true, $currentSpark.id, false)
    await updateBubbleProfileAndRelationship(bubbleId)
  }

  onMount(() => {
    if ($isUserLoggedIn) {
      clearBubbleProfileAndRelationship()
      updateBubbleProfileAndRelationship(bubbleId)
      notFound = !!$observedBubble
    }
    loading = false
  })
</script>

{#if loading}
    <LoadingPage />
{:else}
    {#if $isUserLoggedIn}
        {#if $observedBubble}
            {#if !newBubble}
                <DynamicPageBanner title="" {ariaTitle} />
            {/if}
            <TimelinePage {timeline} >
                <BubbleProfile bubble={$observedBubble}
                              relationship={$observedBubbleRelationship}
                              ourSpark={$currentSpark}
                              {filter}
                />
                {#if canPost }
                    <LazyComposeBox realm="home" {bubbleId} asSpark={$currentSparkId} hidden={hidePage}/>
                {:else if showInvitation }
                    <InfoAside className="warning-aside">
                        {invitationMessage} <button type="button"
                                                                  class="join-cta-button"
                                                                  aria-label="{formatIntl('intl.joinBubble', { bubble: bubbleName })}"
                                                                  on:click|preventDefault="{onJoinButtonClick}">{'intl.joinBubbleButton'}</button>
                    </InfoAside>
                {/if}
            </TimelinePage>
        {:else if notFound}
            <FreeTextLayout>
                <h2>{intl.bubbleNotFound}</h2>
            </FreeTextLayout>
        {/if}
    {:else}
        <HiddenFromSSR>
            <FreeTextLayout>
                <h1>{intl.bubbleProfile}</h1>

                <p>{intl.bubbleNotLoggedIn}</p>
            </FreeTextLayout>
        </HiddenFromSSR>
    {/if}
{/if}

<style>
    .join-cta-button {
        font-size: 1em;
        color: var(--anchor-text);
        border: 0;
        padding: 0;
        background: none;
        justify-self: flex-end;
    }
    .join-cta-button:hover {
        text-decoration: underline;
    }
    .join-cta-button::before {
        margin-right: 5px;
    }
    :global(.warning-aside) {
        margin: 20px;
    }
</style>