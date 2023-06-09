<script>
  import { get } from '../../../_utils/lodash-lite'
  import MediaControlsFix from '../../MediaControlsFix.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { ONE_TRANSPARENT_PIXEL } from '../../../_static/media'
  import { loadSecureMedia } from '../../../_api/media'
  import { accessToken } from '../../../_store/instance'

  export let media

  let loadedMedia = undefined

  $: type = media.type
  $: displaySrc = loadedMedia || ONE_TRANSPARENT_PIXEL
  $: description = media.description || ''
  $: poster = ONE_TRANSPARENT_PIXEL // FIXME: add poster support for videos. media.preview_url;
  $: static_url = media.static_url
  // intrinsic width/height to avoid layout shifting https://chromestatus.com/feature/5695266130755584
  // note pleroma does not give us intrinsic width/height
  $: intrinsicWidth = get(media, ['meta', 'original', 'width'])
  $: intrinsicHeight = get(media, ['meta', 'original', 'height'])

  let player

  onMount(async () => {
    try {
      loadedMedia = await loadSecureMedia($accessToken, media.url)
    } catch (e) {
      console.error('Image loading error', media.url, e)
    }
  })

  onDestroy(() => {
    if (player && !player.paused) {
      player.pause()
    }
  })
</script>

{#if type === 'Video'}
  <video
    class="media-fit"
    aria-label={description}
    src={displaySrc}
    {poster}
    controls
    width={intrinsicWidth}
    height={intrinsicHeight}
    bind:this={player}
  >
    <!--  See https://github.com/sveltejs/svelte/blob/master/site/content/docs/05-accessibility-warnings.md#a11y-media-has-caption -->
    <track kind="captions" />
  </video>
  <MediaControlsFix />
{:else if type === 'Audio'}
  <div class="audio-player-container">
    <audio class="audio-player" aria-label={description} src={displaySrc} controls bind:this={player} />
  </div>
  <MediaControlsFix />
{:else if type === 'gifv'}
  <video
    class="media-fit"
    aria-label={description}
    src={displaySrc}
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
    src={displaySrc}
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
