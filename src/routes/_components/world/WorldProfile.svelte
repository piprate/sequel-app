<script>
  import WorldProfileHeader from './WorldProfileHeader.svelte'
  import WorldProfileJoin from './WorldProfileJoin.svelte'
  import WorldProfileSummary from './WorldProfileSummary.svelte'
  import WorldProfileDetails from './WorldProfileDetails.svelte'
  import NFTMediaTag from '../NFTMediaTag.svelte'
  import { autoplayGifs, underlineLinks } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import WorldProfileFilters from './WorldProfileFilters.svelte'

  export let world
  export let relationship
  export let ourSpark
  export let filter

  $: headerImageIsMissing = !world.header
  $: headerImage = world.header ? ($autoplayGifs ? world.header.url : world.header.staticUrl) : ''
  $: headerNft = world.header && world.header.partOf
  $: worldName = (world && world.name) || ''
  $: className = classname(
    'world-profile',
    headerImageIsMissing && 'header-image-is-missing',
    $underlineLinks && 'underline-links'
  )
  $: profileForWorld = formatIntl('intl.profileForWorld', { world: worldName })

  let worldProfile

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(worldProfile))
  })
</script>

<h1 class="sr-only">{profileForWorld}</h1>
<div class={className} style="background-image: url({headerImage}?id={world.header?.id});" bind:this={worldProfile}>
  <div class="world-profile-grid-wrapper">
    <div class="world-profile-grid">
      <WorldProfileHeader {world} {relationship} />
      <WorldProfileJoin {world} {relationship} {ourSpark} />
      <WorldProfileSummary {world} />
      <WorldProfileDetails {world} {relationship} {ourSpark} />
    </div>
  </div>
  <WorldProfileFilters {world} {filter} />
</div>
{#if headerNft}
  <NFTMediaTag nft={headerNft} position="top" />
{/if}

<style>
  .world-profile {
    position: relative;
    background-size: cover;
    background-position: center;
    padding-top: 175px;
  }

  .world-profile.header-image-is-missing {
    padding-top: 0;
    background-color: #ccc;
  }

  .world-profile-grid {
    display: grid;
    grid-template-areas:
      'avatar     name        label     relationship  membership'
      'avatar     username    username  username      membership'
      'avatar     summary     summary   summary       membership'
      'details    details     details   details       details';
    grid-template-columns: min-content auto 1fr 1fr min-content;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.world-profile-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--world-profile-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.world-profile-grid-wrapper) {
      background-color: var(--world-profile-bg);
    }
  }

  @media (max-width: 767px) {
    .world-profile {
      padding-top: 100px;
    }

    .world-profile-grid {
      display: grid;
      grid-template-areas:
        'avatar     name          membership'
        'avatar     label         membership'
        'avatar     username      membership'
        'avatar     relationship  membership'
        'summary    summary       summary'
        'details    details       details';
      grid-template-columns: min-content minmax(auto, 1fr) min-content;
      grid-template-rows: min-content min-content 1fr min-content;
      padding: 10px;
    }
  }

  @media (max-width: 320px) {
    .world-profile {
      padding-top: 50px;
    }
  }

  @media (max-width: 240px) {
    .world-profile {
      padding-top: 0;
    }
    .world-profile-grid {
      grid-template-areas:
        'avatar       name'
        'avatar       label'
        'username     username'
        'relationship relationship'
        'membership   membership'
        'summary      summary'
        'details      details';
      grid-template-columns: min-content 1fr;
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
