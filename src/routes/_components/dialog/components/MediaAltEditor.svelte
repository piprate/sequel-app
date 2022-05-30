<script>
  import { requestPostAnimationFrame } from '../../../_utils/requestPostAnimationFrame'
  import { mark, stop } from '../../../_utils/marks'
  import { autosize } from '../../../_thirdparty/autosize/autosize'
  import { throttleTimer } from '../../../_utils/throttleTimer'
  import { get } from '../../../_utils/lodash-lite'
  import { setComposeData } from '../../../_store/local'
  import { MEDIA_ALT_CHAR_LIMIT } from '../../../_static/media'
  import LengthGauge from '../../LengthGauge.svelte'
  import LengthIndicator from '../../LengthIndicator.svelte'
  import { length as stringzLength } from 'stringz'
  import { runTesseract } from '../../../_utils/runTesseract'
  import SvgIcon from '../../SvgIcon.svelte'
  import { toast } from '../../toast/toast'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { database } from '../../../_database/database'
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  const updateRawTextInStore = throttleTimer(requestPostAnimationFrame)

  export let className = '';
  export let realm;
  export let mediaItem;
  export let field = '';
  export let index = 0;
  export let media = undefined;

  let rawText = '';
  let mediaAltCharLimit = MEDIA_ALT_CHAR_LIMIT;
  let extracting = false;

  let extractionProgress = 0;

  $: length = stringzLength(rawText || '');
  $: overLimit = length > mediaAltCharLimit;
  $: url = mediaItem.url;
  $: mediaId = mediaItem.data.id;
  $: extractButtonText = extracting ? 'intl.extractingText' : 'intl.extractText';
  $: extractButtonLabel = (() => {
    if (extracting) {
      return formatIntl('intl.extractingTextCompletion', { percent: Math.round(extractionProgress) })
    }
    return extractButtonText
  })();

  function updateMediaItem () {
    if (field) {
      setComposeData(realm, { [field]: mediaItem })
    } else {
      setComposeData(realm, { media });
    }
  }

  let textarea;

  function mediaObserver(mediaItem) {
    const text = mediaItem.description || '';
    if (rawText !== text) {
      rawText = text;
    }
  }

  $: mediaObserver(mediaItem);

  function rawTextObserver(rawText) {
    updateRawTextInStore(() => {
      if (mediaItem.description !== rawText) {
        mediaItem.description = rawText
        updateMediaItem();
      }
      dispatch('resize')
    })
  }

  $: rawTextObserver(rawText);

  function setupAutosize () {
    requestPostAnimationFrame(() => {
      mark('autosize()')
      autosize(textarea)
      stop('autosize()')
    })
  }

  function teardownAutosize () {
    mark('autosize.destroy()')
    autosize.destroy(textarea)
    stop('autosize.destroy()')
  }

  export function measure () {
    autosize.update(textarea)
  }

  async function onClick () {
    extracting = true;
    try {
      const onProgress = progress => {
        requestAnimationFrame(() => {
          extractionProgress = progress * 100;
        })
      }
      const file = await database.getCachedMediaFile(mediaId)
      let text
      if (file) { // Avoid downloading from the network a file that the user *just* uploaded
        const fileUrl = URL.createObjectURL(file)
        try {
          text = await runTesseract(fileUrl, onProgress)
        } finally {
          URL.revokeObjectURL(fileUrl)
        }
      } else {
        text = await runTesseract(url, onProgress)
      }
      if (mediaItem.description !== text) {
        mediaItem.description = text
        updateMediaItem();
      }
    } catch (err) {
      console.error(err)
      /* no await */ toast.say('intl.unableToExtractText')
    } finally {
      extracting = false;
      setTimeout(() => {
        requestAnimationFrame(() => {
          extractionProgress = 0;
        })
      }, 400)
    }
  }

  onMount(() => {
    setupAutosize();
    // setupSyncFromStore();
    // setupSyncToStore();
    return teardownAutosize;
  });
</script>

<div class="media-alt-editor {className}">
  <textarea
          id="the-media-alt-input-{realm}-{index}"
          class="media-alt-input"
          placeholder="{intl.altLabel}"
          bind:this={textarea}
          bind:value={rawText}
  ></textarea>
  <label for="the-media-alt-input-{realm}-{index}" class="sr-only">
    {intl.altLabel}
  </label>
  <LengthGauge
          {length}
          {overLimit}
          max={mediaAltCharLimit}
  />
  <LengthIndicator
          {length}
          {overLimit}
          max={mediaAltCharLimit}
          style="width: 100%; text-align: right;"
  />
<!--  <button class="extract-text-button" type="button"-->
<!--          on:click="{onClick}"-->
<!--          disabled={extracting}-->
<!--          aria-label={extractButtonLabel}-->
<!--  >-->
<!--    <SvgIcon href="{extracting ? '#fa-spinner' : '#fa-magic'}"-->
<!--             className="extract-text-svg {extracting ? 'spin' : ''}"-->
<!--    />-->
<!--    <span>{extractButtonText}</span>-->
<!--  </button>-->
<!--  <LengthGauge-->
<!--          length={extractionProgress}-->
<!--          overLimit={false}-->
<!--          max={100}-->
<!--  />-->
</div>
<style>
  .media-alt-editor {
    display: flex;
    flex-direction: column;
  }
  .media-alt-input {
    padding: 5px;
    border: 1px solid var(--input-border);
    min-height: 40px;
    resize: none;
    overflow: hidden;
    word-wrap: break-word;
    /* Text must be at least 16px or else iOS Safari zooms in */
    font-size: 1.2em;
    max-height: 70vh;
  }

  /*.extract-text-button {*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*  align-items: center;*/
  /*  margin-top: 10px;*/
  /*}*/

  /*.extract-text-button span {*/
  /*  margin-left: 15px;*/
  /*}*/

  /*:global(.extract-text-svg) {*/
  /*  fill: var(--button-text);*/
  /*  width: 18px;*/
  /*  height: 18px;*/
  /*}*/

  @media (max-height: 767px) {
    .media-alt-input {
      max-height: 40vh;
      width: 100%;
      overflow: auto;
    }
    /*.extract-text-button {*/
    /*  margin-top: 0;*/
    /*}*/
    /*button.extract-text-button {*/
    /*  padding: 7px 10px;*/
    /*}*/
  }

  @media (min-height: 768px) {
    .media-alt-input {
      min-width: 250px;
      min-height: 75px;
    }
  }
</style>