<script>
  import { DEFAULT_MEDIA_WIDTH, DEFAULT_MEDIA_HEIGHT, ONE_TRANSPARENT_PIXEL } from '../../_static/media'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { mouseover } from '../../_utils/events'
  import NonAutoplayGifv from '../NonAutoplayGifv.svelte'
  import PlayVideoIcon from '../PlayVideoIcon.svelte'
  import { autoplayGifs, ignoreBlurhash, largeInlineMedia } from '../../_store/local'
  import LazyImage from '../LazyImage.svelte'
  import AutoplayVideo from '../AutoplayVideo.svelte'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { convertCssPropertyToDataUrl } from '../../_utils/convertCssPropertyToDataUrl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  export let media;
  export let uuid;
  export let mediaAttachments;
  export let index;
  export let showAsSensitive;

  let oneTransparentPixel = ONE_TRANSPARENT_PIXEL;
  let mouseoverVar = undefined;

  $: focus = meta && meta.focus;
  // width/height to show inline
  $: inlineWidth = (() => {
    if (!$largeInlineMedia) {
      return '100%'
    }
    return smallWidth || DEFAULT_MEDIA_WIDTH
  })();
  $: inlineHeight = (() => {
    if (!$largeInlineMedia) {
      return 'auto'
    }
    return smallHeight || DEFAULT_MEDIA_HEIGHT
  })();
  $: meta = media.meta;
  $: small = meta && meta.small;
  $: original = meta && meta.original;
  $: smallWidth = small && small.width;
  $: smallHeight = small && small.height;
  $: originalWidth = original && original.width;
  $: originalHeight = original && original.height;
  // width/height to show in a modal
  $: modalWidth = originalWidth || smallWidth || 0;
  $: modalHeight = originalHeight || smallHeight || 0;
  $: noNativeWidthHeight = typeof smallWidth !== 'number' || typeof smallHeight !== 'number';
  $: elementId = `media-${uuid}-${media.id}`;
  $: description = media.description || '';
  $: previewUrl = media.preview_url;
  $: decodedBlurhash = media.decodedBlurhash;
  $: blurhashToUse = (() => {
    if (!$ignoreBlurhash && decodedBlurhash) {
      return decodedBlurhash
    }
    // Convert the var(--loading-bg) variable into a data URL based on a single pixel of color
    // TODO: this is hacky
    return convertCssPropertyToDataUrl('--mask-bg')
  })();
  $: blurhash = showAsSensitive && blurhashToUse;
  $: url = media.url;
  $: type = media.type;
  $: inlineMediaStyle = (() => {
    if ((type === 'audio') || (blurhash && $largeInlineMedia)) {
      return ''
    } else {
      return `width: ${inlineWidth}px; height: ${inlineHeight}px;`
    }
  })();
  $: tabindex = showAsSensitive ? '-1' : '0';
  $: ariaHidden = showAsSensitive;
  $: imageButtonAriaLabel = (
          formatIntl('intl.showImage', { animated: type === 'gifv', description })
  );
  $: videoOrAudioButtonLabel = (
          formatIntl('intl.playVideoOrAudio', { audio: type === 'audio', description })
  );
  $: animatedLabel = (
          formatIntl('intl.animatedImage', { description })
  );

  function onClick () {
    (async () => {
      const showMediaDialog = await importShowMediaDialog()
      showMediaDialog(mediaAttachments, index)
    })()
    return true
  }

  onMount(() => {
    return registerClickDelegate(elementId, () => onClick())
  });
</script>

{#if !blurhash && (type === 'video' || type === 'audio')}
  <button id={elementId}
          type="button"
          class="inline-media play-video-button focus-after {$largeInlineMedia ? '' : 'fixed-size'} {type === 'audio' ? 'play-audio-button' : ''}"
          aria-label={videoOrAudioButtonLabel}
          {tabindex}
          aria-hidden={ariaHidden}
          style={inlineMediaStyle}>
    <PlayVideoIcon />
    {#if type === 'video'}
      <LazyImage
              alt={description}
              title={description}
              src={previewUrl}
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
              fallback={oneTransparentPixel}
              {blurhash}
              width={inlineWidth}
              height={inlineHeight}
              background="var(--loading-bg)"
              {focus}
      />
    {/if}
  </button>
{/if}
<style>

  :global(.status-media video, .status-media img) {
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