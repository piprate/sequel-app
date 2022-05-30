<script>
  import ComposeToolbar from './ComposeToolbar.svelte'
  import ComposeLengthGauge from './ComposeLengthGauge.svelte'
  import ComposeLengthIndicator from './ComposeLengthIndicator.svelte'
  import ComposeAuthor from './ComposeAuthor.svelte'
  import ComposeInput from './ComposeInput.svelte'
  import ComposeStickyButton from './ComposeStickyButton.svelte'
  import ComposeMedia from './ComposeMedia.svelte'
  import ComposeContentWarning from './ComposeContentWarning.svelte'
  import ComposeFileDrop from './ComposeFileDrop.svelte'
  import ComposeAutosuggest from './ComposeAutosuggest.svelte'
  import { measureText } from '../../_utils/measureText'
  import { POST_PRIVACY_OPTIONS } from '../../_static/posts'
  import { currentComposeData, currentSparkId, maxPostChars } from '../../_store/instance'
  import { slide } from '../../_transitions/slide'
  import { publishingPost, publishPost, setReplyVisibility } from '../../_actions/compose'
  import { goto } from '@sapper/app'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { onMount } from 'svelte'
  import { currentTimeline, observedBubbleRelationship } from '../../_store/local'
  import { unwrap } from '../../_utils/mapper'

  export let realm
  export let bubbleId
  export let asSpark = undefined
  export let autoFocus = false
  export let dialogId = undefined
  export let hidden = false
  export let hideBottomBorder = false
  export let isReply = false
  export let replyVisibility = undefined
  export let replySpoiler = undefined
  export let inReplyToUuid = undefined  // typical replies, using App-specific uuid

  // suppress warnings
  replySpoiler = undefined

  let size = undefined
  let aboutToPublishPost = false

  $: computedClassName = classname(
    'compose-box',
    `compose-box-realm-${realm}`,
    overLimit && 'over-char-limit',
    isReply && postPrivacyKey === 'subscribers' && 'subscriber-reply'
  )
  $: hideAndFadeIn = classname(
    'compose-box-fade-in',
    hidden && 'hidden'
  )
  $: showSticky = realm === 'home' // FIXME
  $: composeData = $currentComposeData[realm] || {}
  $: text = composeData.text || ''
  $: media = composeData.media || []
  $: inReplyToId = composeData.inReplyToId  // delete-and-redraft replies, using standard id
  $: postPrivacy = POST_PRIVACY_OPTIONS.find(_ => _.key === postPrivacyKey)
  $: defaultPostPrivacyKey = (
    ($observedBubbleRelationship && $observedBubbleRelationship.defaultVisibility) || 'private'
  )
  $: postPrivacyKey = composeData.postPrivacy || defaultPostPrivacyKey
  $: textLength = measureText(text)
  $: contentWarningLength = measureText(contentWarning)
  $: length = (
    textLength + (contentWarningShown ? contentWarningLength : 0)
  )
  $: overLimit = length > $maxPostChars
  $: contentWarningShown = composeData.contentWarningShown
  $: contentWarning = composeData.contentWarning || ''
  $: sensitive = !!composeData.sensitive

  async function doPublishPost () {
    if (aboutToPublishPost || $publishingPost) { // do nothing if the user rapidly taps the Ctrl-Enter key
      console.log('ignored post command', { aboutToPublishPost, $publishingPost })
      return
    }
    if (!bubbleId) {
      console.log('bubble ID not provided')
      return
    }
    // The reason we add a scheduleIdleTask delay here is because we also use scheduleIdleTask
    // in ComposeInput.html to debounce the input events. If the user is very fast at typing
    // at their keyboard and quickly presses Ctrl+Enter or the "Publish" button then there could
    // be a race condition where not all of their post is published.
    aboutToPublishPost = true
    scheduleIdleTask(() => {
      aboutToPublishPost = false
      doPublishPostAfterDelay()
    })
  }

  function doPublishPostAfterDelay () {
    const inReplyTo = inReplyToId || ((realm === 'home' || realm === 'dialog') ? null : realm)

    if (overLimit || (!text && !media.length)) {
      return // do nothing if invalid
    }

    if (!asSpark) {
      asSpark = $currentSparkId
    }

    /* no await */
    publishPost(realm, bubbleId, asSpark, text, composeData.originalPostId, inReplyTo, media, postPrivacyKey, inReplyToUuid)

    if (inReplyTo && ($currentTimeline !== `post/${unwrap(inReplyTo)}`)) {
      // we published a comment. Navigate to the comment's ancestor to display the conversation
      goto(`/posts/${unwrap(inReplyTo)}`)
    }
  }

  onMount(() => {
    // if (realm !== 'home' && realm !== 'dialog') {
    //   // if this is a reply, populate the handle immediately
    //   /* no await */
    //   insertHandleForReply(realm);
    // }

    // if (replySpoiler) {
    //   // default spoiler is same as the replied-to post
    //   setReplySpoiler(realm, replySpoiler);
    // }

    if (replyVisibility) {
      // make sure the visibility is consistent with the replied-to post
      setReplyVisibility(realm, replyVisibility)
    }
  })
</script>

{#if realm === 'home'}
  <h1 class="sr-only">{intl.composePost}</h1>
{/if}
<ComposeFileDrop {realm} >
  <div class="{computedClassName} {hideAndFadeIn}">
    <ComposeAuthor {realm} {dialogId} />
    {#if contentWarningShown}
      <div class="compose-content-warning-wrapper"
           transition:slide="{{duration: 333}}">
        <ComposeContentWarning {realm} {contentWarning} />
      </div>
    {/if}
    <ComposeInput {realm} {text} {autoFocus} on:publishAction="{doPublishPost}" />
    <ComposeLengthGauge {length} {overLimit} />
    <ComposeAutosuggest {realm} {dialogId} />
    <ComposeToolbar {realm} {postPrivacy} {media} {contentWarningShown} />
    <ComposeLengthIndicator {length} {overLimit} />
    <ComposeMedia {realm} {media} />
<!--    <ComposeMediaSensitive {realm} {media} {sensitive} {contentWarning} {contentWarningShown} />-->
  </div>
</ComposeFileDrop>
<ComposeStickyButton {showSticky}
                     {overLimit}
                     {hideAndFadeIn}
                     on:publishAction="{doPublishPost}" />
{#if !hideBottomBorder}
  <div class="compose-box-border-bottom {hideAndFadeIn}"></div>
{/if}

<style>
  .compose-box {
    border-radius: 4px;
    padding: 20px 20px 0 20px;
    display: grid;
    align-items: flex-start;
    grid-template-areas:
      "avatar name        handle      handle"
      "avatar cw          cw          cw"
      "avatar input       input       input"
      "avatar gauge       gauge       gauge"
      "avatar autosuggest autosuggest autosuggest"
      "avatar toolbar     toolbar     length"
      "avatar media       media       media"
      "avatar sensitive   sensitive   sensitive";
    grid-template-columns: min-content minmax(0, max-content) 1fr 1fr;
    position: relative;
  }

  .compose-box.subscriber-reply {
    background-color: var(--post-subscribers-background);
  }

  :global(.compose-box-fade-in) {
    transition: opacity 0.2s linear; /* main page reveal */
  }

  .compose-box-border-bottom {
    height: 1px;
    background: var(--main-border);
    width: 100%;
  }

  .compose-content-warning-wrapper {
    grid-area: cw;
  }

  @media (max-width: 767px) {
    .compose-box {
      padding: 10px 10px 0 10px;
    }

    .compose-box-realm-dialog {
      overflow-x: hidden;
    }
  }

  @media (max-width: 240px) {
    .compose-box {
      padding: 10px 5px 0 5px;
    }
  }
</style>
