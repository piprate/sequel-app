<script>
  import BubbleProfileHeader from './BubbleProfileHeader.svelte'
  import BubbleProfileJoin from './BubbleProfileJoin.svelte'
  import BubbleProfileSummary from './BubbleProfileSummary.svelte'
  import BubbleProfileDetails from './BubbleProfileDetails.svelte'
  import NFTMediaTag from '../NFTMediaTag.svelte'
  import { autoplayGifs, underlineLinks } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import BubbleProfileFilters from './BubbleProfileFilters.svelte'

  export let bubble
  export let relationship
  export let ourSpark
  export let filter
  export let joined
  export let loading
  export let onJoinButtonClick

  $: headerImageIsMissing = !bubble.header
  $: headerImage = bubble.header ?
          ($autoplayGifs ?
                  bubble.header.url :
                  bubble.header.staticUrl) :
          ''
  $: headerNft = bubble.header && bubble.header.partOf
  $: bubblename = (bubble && bubble.name) || ''
  $: className = classname(
          'bubble-profile',
          headerImageIsMissing && 'header-image-is-missing',
          $underlineLinks && 'underline-links'
  )
  $: profileForBubble = formatIntl('intl.profileForBubble', { bubble: bubblename })

  let bubbleProfile

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(bubbleProfile))
  })
</script>

<h1 class="sr-only">{profileForBubble}</h1>
<div id={bubble.header.id} class={className}
     style="background-image: url({headerImage}?id={bubble.header?.id});"
     bind:this={bubbleProfile}>
  <div class="bubble-profile-grid-wrapper">
    <div class="bubble-profile-grid">
      <BubbleProfileHeader {bubble} {relationship} />
      <BubbleProfileJoin {bubble} {relationship} {ourSpark} {loading} {joined} {onJoinButtonClick} />
      <BubbleProfileSummary {bubble} />
      <BubbleProfileDetails {bubble} {relationship} {ourSpark} />
    </div>
  </div>
  <BubbleProfileFilters {bubble} {filter} />
</div>
{#if headerNft}
  <NFTMediaTag nft={headerNft} position="top" />
{/if}
<style>
  .bubble-profile {
    position: relative;
    background-size: cover;
    background-position: center;
    padding-top: 175px;
  }

  .bubble-profile.header-image-is-missing {
    padding-top: 0;
    background-color: #ccc;
  }

  .bubble-profile-grid {
    display: grid;
    grid-template-areas: "avatar     name         name         relationship  membership"
                         "avatar     attributes   attributes   attributes    membership"
                         "avatar     properties   properties   properties    membership"
                         "summary    summary      summary      summary       summary"
                         "details    details      details      details       details";
    grid-template-columns: min-content auto 1fr 1fr min-content;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.bubble-profile-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--bubble-profile-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.bubble-profile-grid-wrapper) {
      background-color: var(--bubble-profile-bg);
    }
  }

  @media (max-width: 767px) {
    .bubble-profile {
      padding-top: 100px;
    }

    .bubble-profile-grid {
      display: grid;
      grid-template-areas: "avatar      name          membership"
                           "avatar      relationship  membership"
                           "avatar      attributes    membership"
                           "summary     summary       summary"
                           "properties  properties    properties"
                           "details     details       details";
      grid-template-columns: min-content minmax(auto, 1fr) min-content;
      grid-template-rows: min-content min-content 1fr min-content;
      padding: 10px;
    }
  }

  @media (max-width: 320px) {
    .bubble-profile {
      padding-top: 50px;
    }
  }

  @media (max-width: 240px) {
    .bubble-profile {
      padding-top: 0;
    }
    .bubble-profile-grid {
      grid-template-areas: "avatar       name"
                           "avatar       label"
                           "relationship relationship"
                           "attributes   attributes"
                           "membership   membership"
                           "summary      summary"
                           "properties   properties"
                           "details      details";
      grid-template-columns: min-content 1fr;
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
