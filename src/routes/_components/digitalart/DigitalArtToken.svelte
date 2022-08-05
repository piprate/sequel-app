<script>
  import DigitalArtHeader from './DigitalArtHeader.svelte'
  import DigitalArtTokenDetails from './DigitalArtTokenDetails.svelte'
  import DigitalArtSummary from './DigitalArtSummary.svelte'
  import { underlineLinks } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { onMount } from 'svelte'
  import SparkRole from '../SparkRole.svelte'
  import CreatedAt from '../CreatedAt.svelte'

  export let token
  export let ourSpark

  $: name = (token && token.object.name) || ''
  $: className = classname(
          'digital-art',
          $underlineLinks && 'underline-links'
  )
  $: profileForListing = name
  $: displayArtist = token.object.attributedTo !== token.object.artist

  let tokenProfile

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(tokenProfile))
  })
</script>

<h1 class="sr-only">{profileForListing}</h1>
<div class={className}
     bind:this={tokenProfile}>
  <div class="digital-art-grid-wrapper">
    <div class="digital-art-grid">
      <DigitalArtHeader digitalArt={token.object} />
      <DigitalArtSummary digitalArt={token.object} />
      <div class="digital-art-created">
        <CreatedAt createdAt={token.object.createdAt} flavour="created" />
      </div>
      {#if displayArtist }
        <div class="artist-panel">
          <SparkRole spark={token.artistRef} roleLabel="Attribution" />
        </div>
      {/if}
      <DigitalArtTokenDetails {token} {ourSpark} />
    </div>
  </div>
</div>
<style>
  .digital-art {
    position: relative;
    background-size: cover;
    background-position: center;
  }

  .digital-art-grid {
    display: grid;
    grid-template-areas:
            "image     image"
            "name      name"
            "label     label"
            "summary   summary"
            "created   created"
            "artist    artist"
            "details   details";
    grid-template-rows: repeat(9, min-content);
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  .digital-art-created {
    grid-area: created;
    font-size: 1.1em;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .artist-panel {
    grid-area: artist;
    margin: 5px 5px 0 0;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.digital-art-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--digital-art-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.digital-art-grid-wrapper) {
      background-color: var(--digital-art-bg);
    }
  }

  @media (max-width: 767px) {
    .digital-art-grid {
      display: grid;
      grid-template-areas:
            "image     image"
            "name      name"
            "label     label"
            "summary   summary"
            "created   created"
            "artist    artist"
            "details   details";
      grid-template-rows: repeat(7, min-content);
      padding: 10px;
    }
    .digital-art-created {
      font-size: 1.0em;
      align-self: flex-start;
    }
  }

  @media (max-width: 320px) {
  }

  @media (max-width: 240px) {
    .digital-art-grid {
      grid-template-areas:
              "image"
              "name"
              "label"
              "created"
              "summary"
              "artist"
              "details";
      grid-template-rows: repeat(7, min-content);
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
