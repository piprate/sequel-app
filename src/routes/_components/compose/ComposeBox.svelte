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
  import ComposePoll from './ComposePoll.svelte'
  import ComposeMediaSensitive from './ComposeMediaSensitive.svelte'
  import { measureText } from '../../_utils/measureText'
  import { POST_PRIVACY_OPTIONS } from '../../_static/statuses'
  import { currentComposeData, currentVerifyCredentials, maxStatusChars } from '../../_store/instance'
  import { slide } from '../../_transitions/slide'
  import { postStatus, postingStatus, insertHandleForReply, setReplySpoiler, setReplyVisibility } from '../../_actions/compose'
  import { classname } from '../../_utils/classname'
  import { POLL_EXPIRY_DEFAULT } from '../../_static/polls'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { onMount } from "svelte";

  export let realm;
  export let autoFocus = false;
  export let dialogId = undefined;
  export let hidden = false;
  export let hideBottomBorder = false;
  export let isReply = false;
  export let replyVisibility = undefined;
  export let replySpoiler = undefined;
  export let inReplyToUuid = undefined;  // typical replies, using Pinafore-specific uuid

  let size = undefined;
  let aboutToPostStatus = false;

  $: computedClassName = classname(
          'compose-box',
          `compose-box-realm-${realm}`,
          overLimit && 'over-char-limit',
          isReply && postPrivacyKey === 'direct' && 'direct-reply'
  );
  $: hideAndFadeIn = classname(
          'compose-box-fade-in',
          hidden && 'hidden'
  );
  $: showSticky = realm === 'home';
  $: composeData = $currentComposeData[realm] || {};
  $: text = composeData.text || '';
  $: media = composeData.media || [];
  $: poll = composeData.poll;
  $: inReplyToId = composeData.inReplyToId;  // delete-and-redraft replies, using standard id
  $: postPrivacy = POST_PRIVACY_OPTIONS.find(_ => _.key === postPrivacyKey);
  $: defaultPostPrivacyKey = (
          ($currentVerifyCredentials && $currentVerifyCredentials.source.privacy) || 'public'
  );
  $: postPrivacyKey = composeData.postPrivacy || defaultPostPrivacyKey;
  $: textLength = measureText(text);
  $: contentWarningLength = measureText(contentWarning);
  $: length = (
          textLength + (contentWarningShown ? contentWarningLength : 0)
  );
  $: overLimit = length > $maxStatusChars;
  $: contentWarningShown = composeData.contentWarningShown;
  $: contentWarning = composeData.contentWarning || '';
  $: sensitive = !!composeData.sensitive;

  async function doPostStatus () {
    if (aboutToPostStatus || $postingStatus) { // do nothing if the user rapidly taps the Ctrl-Enter key
      console.log('ignored post command', { aboutToPostStatus, $postingStatus })
      return
    }
    // The reason we add a scheduleIdleTask delay here is because we also use scheduleIdleTask
    // in ComposeInput.html to debounce the input events. If the user is very fast at typing
    // at their keyboard and quickly presses Ctrl+Enter or the "Toot" button then there could
    // be a race condition where not all of their status is posted.
    aboutToPostStatus = true;
    scheduleIdleTask(() => {
      aboutToPostStatus = false;
      doPostStatusAfterDelay();
    })
  }

  function doPostStatusAfterDelay () {
    const mediaIds = media.map(_ => _.data.id)
    const mediaDescriptions = media.map(_ => _.description)
    const mediaFocalPoints = media.map(_ => [_.focusX, _.focusY])
    const inReplyTo = inReplyToId || ((realm === 'home' || realm === 'dialog') ? null : realm)

    if (overLimit || (!text && !media.length)) {
      return // do nothing if invalid
    }

    const hasPoll = poll && poll.options && poll.options.length
    if (hasPoll) {
      // validate poll
      if (poll.options.length < 2 || !poll.options.every(Boolean)) {
        return
      }
    }

    // convert internal poll format to the format Mastodon's REST API uses
    const pollToPost = hasPoll && {
      expires_in: (poll.expiry || POLL_EXPIRY_DEFAULT).toString(),
      multiple: !!poll.multiple,
      options: poll.options
    }

    /* no await */ postStatus(realm, text, inReplyTo, mediaIds,
            sensitive, contentWarning, postPrivacyKey,
            mediaDescriptions, inReplyToUuid, pollToPost,
            mediaFocalPoints)
  }

  onMount(() => {
    if (realm !== 'home' && realm !== 'dialog') {
      // if this is a reply, populate the handle immediately
      /* no await */ insertHandleForReply(realm)
    }

    if (replySpoiler) {
      // default spoiler is same as the replied-to status
      setReplySpoiler(realm, replySpoiler)
    }

    if (replyVisibility) {
      // make sure the visibility is consistent with the replied-to status
      setReplyVisibility(realm, replyVisibility)
    }
  })
</script>

{#if realm === 'home'}
  <h1 class="sr-only">{intl.composeStatus}</h1>
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
    <ComposeInput {realm} {text} {autoFocus} on:postAction="{doPostStatus}" />
    <ComposeLengthGauge {length} {overLimit} />
    <ComposeAutosuggest {realm} {dialogId} />
    {#if poll && poll.options && poll.options.length}
      <div class="compose-poll-wrapper"
           transition:slide="{{duration: 333}}">
        <ComposePoll {realm} {poll} />
      </div>
    {/if}
    <ComposeToolbar {realm} {postPrivacy} {media} {contentWarningShown} {poll} />
    <ComposeLengthIndicator {length} {overLimit} />
    <ComposeMedia {realm} {media} />
    <ComposeMediaSensitive {realm} {media} {sensitive} {contentWarning} {contentWarningShown} />
  </div>
</ComposeFileDrop>
<ComposeStickyButton {showSticky}
                     {overLimit}
                     {hideAndFadeIn}
                     on:postAction="{doPostStatus}" />
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
      "avatar poll        poll        poll"
      "avatar toolbar     toolbar     length"
      "avatar media       media       media"
      "avatar sensitive   sensitive   sensitive";
    grid-template-columns: min-content minmax(0, max-content) 1fr 1fr;
    position: relative;
  }

  .compose-box.direct-reply {
    background-color: var(--status-direct-background);
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

  .compose-poll-wrapper {
    grid-area: poll;
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
