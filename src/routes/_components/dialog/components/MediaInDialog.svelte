<script>
  import { get } from '../../../_utils/lodash-lite'
  import MediaControlsFix from '../../MediaControlsFix.svelte'
  import {onDestroy} from "svelte";

  export let media;

  $: type = media.type;
  $: url = media.url;
  $: description = media.description || '';
  $: poster = media.preview_url;
  $: static_url = media.static_url;
  // intrinsic width/height to avoid layout shifting https://chromestatus.com/feature/5695266130755584
  // note pleroma does not give us intrinsic width/height
  $: intrinsicWidth = get(media, ['meta', 'original', 'width']);
  $: intrinsicHeight = get(media, ['meta', 'original', 'height']);

  let player;

  onDestroy(() => {
    if (player && !player.paused) {
      player.pause()
    }
  })
</script>

{#if type === 'video'}
  <video
    class="media-fit"
    aria-label={description}
    src={url}
    {poster}
    controls
    width={intrinsicWidth}
    height={intrinsicHeight}
    bind:this={player}
  />
  <MediaControlsFix />
{:else if type === 'audio'}
  <div class="audio-player-container">
    <audio
      class="audio-player"
      aria-label={description}
      src={url}
      controls
      bind:this={player}
    />
  </div>
  <MediaControlsFix />
{:else if type === 'gifv'}
  <video
    class="media-fit"
    aria-label={description}
    src={url}
    {poster}
    autoplay
    muted
    loop
    webkit-playsinline
    playsinline
    width={intrinsicWidth}
    height={intrinsicHeight}
  />
{:else}
  <img
    class="media-fit"
    alt={description}
    title={description}
    src={url}
    width={intrinsicWidth}
    height={intrinsicHeight}
  />
{/if}
<style>
  .media-fit {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  .audio-player-container {
    min-height: 50vh;
    min-width: 400px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--audio-bg);
  }
  .audio-player {
    padding: 30px 10px;
    margin: 10px;
  }
  @media (max-width: 767px) {
    .audio-player-container {
      min-height: 200px;
      min-width: calc(100vw - 40px);
      align-items: center;
    }
  }
</style>
