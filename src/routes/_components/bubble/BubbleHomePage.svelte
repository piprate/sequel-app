<script>
  import TimelinePage from '../TimelinePage.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { isUserLoggedIn, observedBubble, observedBubbleRelationship } from '../../_store/local.js'
  import { currentSpark } from '../../_store/instance.js'
  import RestrictedPageWarning from '../RestrictedPageWarning.svelte'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { clearBubbleProfileAndRelationship, updateBubbleProfileAndRelationship } from '../../_actions/bubbles'
  import BubbleProfile from './BubbleProfile.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import InfoAside from '../InfoAside.svelte'
  import { updateMembership } from '../../_actions/bubble/membership'

  export let bubbleId
  export let newBubble = false
  export let filter

  let overrideJoined

  $: bubble = $observedBubble
  $: relationship = $observedBubbleRelationship
  $: joined = (() => {
    if (typeof overrideJoined === 'boolean') {
      return overrideJoined
    }
    return relationship && relationship.status === 'active'
  })()
  $: bubbleName = (bubble && bubble.name) || ''
  $: timeline = `bubble/${bubbleId}` + (filter ? `/${filter}` : '')
  $: ariaTitle = formatIntl('intl.homePageForBubble', { bubble: bubbleName })
  $: hidePage = !(relationship && relationship.status === 'active')
  $: canPost = (() => {
    if ($currentSpark && relationship) {
      return relationship.canPost
    }
    return false
  })()
  $: showCompose = canPost && !hidePage
  $: canJoin = bubble && relationship && relationship.status !== 'active' && bubble.membershipMode !== 'invite_only'
  $: showReadWarning = canJoin && bubble.observerMode === 'members'
  $: showPostWarning = canJoin && !canPost && bubble.writerMode !== 'none'
  $: showInvitation = showReadWarning || showPostWarning
  $: invitationMessage = showReadWarning ? 'intl.inviteToRead' : 'intl.inviteToPost'

  let loading = false
  let notFound = false
  let loadError

  async function onJoinButtonClick(e, newJoinedValue, toastOnSuccess) {
    e?.stopPropagation()
    loading = true
    await updateMembership(
      bubbleId,
      typeof newJoinedValue === 'boolean' ? newJoinedValue : true,
      $currentSpark.id,
      toastOnSuccess || false
    )
    loading = false
    await updateBubbleProfileAndRelationship(bubbleId)
  }

  onMount(async () => {
    if ($isUserLoggedIn) {
      try {
        await clearBubbleProfileAndRelationship()
        await updateBubbleProfileAndRelationship(bubbleId)
        notFound = !$observedBubble
      } catch (e) {
        console.error(e)
        loadError = e
      }
    }
  })
</script>

{#if $isUserLoggedIn}
  {#if $observedBubble}
    {#if !newBubble}
      <DynamicPageBanner title="" {ariaTitle} />
    {/if}
    <TimelinePage {timeline} {bubbleId} {showCompose}>
      <BubbleProfile
        bubble={$observedBubble}
        relationship={$observedBubbleRelationship}
        ourSpark={$currentSpark}
        {filter}
        {joined}
        {loading}
        {onJoinButtonClick}
      />
      {#if showInvitation}
        <InfoAside className="warning-aside">
          {invitationMessage}
          <button
            type="button"
            class="join-cta-button"
            aria-label={formatIntl('intl.joinBubble', { bubble: bubbleName })}
            on:click|preventDefault={onJoinButtonClick}>{'intl.joinBubbleButton'}</button
          >
        </InfoAside>
      {/if}
    </TimelinePage>
  {:else if notFound}
    <FreeTextLayout>
      <h2>{intl.bubbleNotFound}</h2>
    </FreeTextLayout>
  {:else if loadError}
    <ErrorMessage error={loadError} />
  {:else}
    <LoadingPage />
  {/if}
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
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
