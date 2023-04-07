<script>
  import NonAutoplayGifv from '../NonAutoplayGifv.svelte'
  import PlayVideoIcon from '../PlayVideoIcon.svelte'
  import LazyImage from '../LazyImage.svelte'
  import AutoplayVideo from '../AutoplayVideo.svelte'
  import NFTMediaTag from '../NFTMediaTag.svelte'
  import { DEFAULT_MEDIA_HEIGHT, DEFAULT_MEDIA_WIDTH, ONE_TRANSPARENT_PIXEL } from '../../_static/media'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { mouseover } from '../../_utils/events'
  import { autoplayGifs, ignoreBlurhash, largeInlineMedia } from '../../_store/local'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { convertCssPropertyToDataUrl } from '../../_utils/convertCssPropertyToDataUrl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let media
  export let uuid
  export let mediaAttachments
  export let index
  export let showAsSensitive
  export let showNFT = false

  let oneTransparentPixel = ONE_TRANSPARENT_PIXEL
  let mouseoverVar = undefined

  $: focus = meta && meta.focus
  // width/height to show inline
  $: inlineWidth = (() => {
    if (!$largeInlineMedia) {
      return '100%'
    }
    return previewWidth || DEFAULT_MEDIA_WIDTH
  })()
  $: inlineHeight = (() => {
    if (!$largeInlineMedia) {
      return 'auto'
    }
    return previewHeight || DEFAULT_MEDIA_HEIGHT
  })()
  $: inlineWidthText = $largeInlineMedia ? `${inlineWidth}px` : inlineWidth
  $: inlineHeightText = $largeInlineMedia ? `${inlineHeight}px` : inlineHeight
  $: meta = media.meta
  $: preview = media.thumbnails && media.thumbnails.preview
  $: previewWidth = preview && preview.width
  $: previewHeight = preview && preview.height
  $: noNativeWidthHeight = typeof previewWidth !== 'number' || typeof previewHeight !== 'number'
  $: elementId = `media-${uuid}-${media.id}`
  $: description = media.description || ''
  $: previewUrl = media.previewUrl
  $: decodedBlurhash = media.decodedBlurhash
  $: blurhashToUse = (() => {
    if (!$ignoreBlurhash && decodedBlurhash) {
      return decodedBlurhash
    }
    // Convert the var(--loading-bg) variable into a data URL based on a single pixel of color
    // TODO: this is hacky
    return convertCssPropertyToDataUrl('--mask-bg')
  })()
  $: blurhash = showAsSensitive && blurhashToUse
  $: url = media.url
  $: type = media.type
  $: inlineMediaStyle = (() => {
    if ((type === 'Audio') || (blurhash && $largeInlineMedia)) {
      return ''
    } else {
      return `width: ${inlineWidthText}; height: ${inlineHeightText};`
    }
  })()
  $: tabindex = showAsSensitive ? '-1' : '0'
  $: ariaHidden = showAsSensitive
  $: imageButtonAriaLabel = (
          formatIntl('intl.showImage', { animated: type === 'gifv', description })
  )
  $: videoOrAudioButtonLabel = (
          formatIntl('intl.playVideoOrAudio', { audio: type === 'Audio', description })
  )
  $: animatedLabel = (
          formatIntl('intl.animatedImage', { description })
  )
  $: nftReference = media.partOf

  function onClick () {
    (async () => {
      const showMediaDialog = await importShowMediaDialog()
      showMediaDialog(mediaAttachments, index)
    })()
    return true
  }

  onMount(() => {
    return registerClickDelegate(elementId, () => onClick())
  })
</script>

{#if !blurhash && (type === 'Video' || type === 'Audio')}
  <button id={elementId}
          type="button"
          class="inline-media play-video-button focus-after {$largeInlineMedia ? '' : 'fixed-size'} {type === 'Audio' ? 'play-audio-button' : ''}"
          aria-label={videoOrAudioButtonLabel}
          {tabindex}
          aria-hidden={ariaHidden}
          style={inlineMediaStyle}>
    <PlayVideoIcon/>
    {#if type === 'Video'}
      <!-- FIXME: src should be previewUrl. Update when video previews are available. -->
      <LazyImage
              alt={description}
              title={description}
              src={oneTransparentPixel}
              fallback={oneTransparentPixel}
              {blurhash}
              width={inlineWidth}
              height={inlineHeight}
              background="var(--loading-bg)"
              {focus}
      />
    {/if}
  </button>
{:else}
  <button id={elementId}
          type="button"
          class="inline-media show-image-button focus-after {$largeInlineMedia ? '' : 'fixed-size'}"
          aria-label={imageButtonAriaLabel}
          title={description}
          use:mouseover="{ (event) => { mouseoverVar = event } }"
          style={inlineMediaStyle}
          {tabindex}
          aria-hidden={ariaHidden}
  >
    {#if type === 'gifv' && $autoplayGifs && !blurhash}
      <AutoplayVideo
              ariaLabel={animatedLabel}
              poster={previewUrl}
              src={url}
              width={inlineWidth}
              height={inlineHeight}
              {focus}
      />
    {:else if type === 'gifv'}
      <NonAutoplayGifv
              class={noNativeWidthHeight ? 'no-native-width-height' : ''}
              label={animatedLabel}
              poster={previewUrl}
              {blurhash}
              {blurhashToUse}
              src={url}
              staticSrc={previewUrl}
              useWidthHeight={!blurhash}
              width={inlineWidth}
              height={inlineHeight}
              playing={mouseoverVar}
              {focus}
      />
    {:else}
      <LazyImage
              alt={description}
              title={description}
              src={previewUrl}
              fallback={blurhashToUse || oneTransparentPixel}
              {blurhash}
              width={inlineWidth}
              height={inlineHeight}
              background="var(--loading-bg)"
              {focus}
      />
    {/if}
    {#if showNFT && nftReference}
      <NFTMediaTag nft={nftReference}/>
    {/if}
  </button>
{/if}
<style>

  :global(.post-media video, .post-media img) {
    object-fit: cover;
  }
  .play-video-button, .show-image-button {
    margin: auto;
    padding: 0;
    border-radius: 0;
    border: none;
    background: none;
  }
  .play-audio-button {
    background: var(--audio-bg);
  }

  .show-image-button {
    cursor: zoom-in;
  }

  .inline-media {
    position: relative;
  }

  @media (max-width: 240px) {
    .inline-media {
      min-height: 100px; /* TODO: hack for KaiOS, which renders the grouped-images style as 0 height */
    }
  }
</style>