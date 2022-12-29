<script>
  import SvgIcon from './SvgIcon.svelte'
  import { setComposeData } from '../_store/local'
  import { deleteMedia } from '../_actions/media'
  import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
  import { autosize } from '../_thirdparty/autosize/autosize'
  import { ONE_TRANSPARENT_PIXEL } from '../_static/media'
  import { get } from '../_utils/lodash-lite'
  import { coordsToPercent } from '../_utils/coordsToPercent'
  import { importShowMediaEditDialog } from './dialog/asyncDialogs/importShowMediaEditDialog.js'
  import { throttleTimer } from '../_utils/throttleTimer'
  import { onMount } from 'svelte'
  import { loadSecureMedia } from '../_api/media'
  import { accessToken } from '../_store/instance'
  import { inBrowser } from '../_utils/browserOrNode';

  const updateMediaInStore = throttleTimer(scheduleIdleTask)
  const resizeTextarea = inBrowser() && throttleTimer(requestAnimationFrame)

  export let realm
  export let mediaItem
  export let field = ''
  export let index = 0
  export let media = undefined

  let rawText = ''
  let focusX = 0
  let focusY = 0

  $: type = mediaItem.data.type
  $: mediaId = mediaItem.data.id
  $: shortName = (
          // sometimes we no longer have the file, e.g. in a delete and redraft situation,
          // so fall back to the description if it was provided
          get(mediaItem, ['file', 'name']) || get(mediaItem, ['description']) || 'media'
  )
  $: uuid = `${realm}-${mediaItem.data.uploadID}`
  $: objectPosition = (() => {
    if (!focusX && !focusY) {
      return 'center center'
    }
    return `${coordsToPercent(focusX)}% ${100 - coordsToPercent(focusY)}%`
  })()

  let textarea

  function mediaObserver (mediaItem) {
    const text = mediaItem.description || ''
    if (rawText !== text) {
      rawText = text
      resizeTextarea(() => autosize.update(textarea))
    }
    focusX = mediaItem.focusX || 0
    focusY = mediaItem.focusY || 0
  }

  $: mediaObserver(mediaItem)

  let previousMediaId = mediaItem.data.id

  async function previewObserver (id) {
    // reload preview if new media has been uploaded
    if (previousMediaId !== mediaId) {
      previousMediaId = mediaId

      await loadPreview(mediaItem)
    }
  }

  $: previewObserver(mediaId)

  function rawTextObserver (rawText) {
    updateMediaInStore(() => {
      if (mediaItem.description !== rawText) {
        mediaItem.description = rawText
        if (field) {
          setComposeData(realm, { [field]: mediaItem })
        } else {
          setComposeData(realm, { media })
        }
      }
    })
  }

  $: rawTextObserver(rawText)

  function setupAutosize () {
    autosize(textarea)
  }

  function teardownAutosize () {
    autosize.destroy(textarea)
  }

  function onDeleteMedia () {
    deleteMedia(realm, field, index)
  }

  async function onEdit (e) {
    e.preventDefault()
    e.stopPropagation()

    const showMediaEditDialog = await importShowMediaEditDialog()
    showMediaEditDialog(realm, field, index, type)
  }

  let preview = ONE_TRANSPARENT_PIXEL

  async function loadPreview (mediaItem) {
    if (type !== 'Audio') {
      try {
        preview = await loadSecureMedia($accessToken, mediaItem.previewUrl)
      } catch (e) {
        console.error('Image loading error', mediaItem.previewUrl, e)
      }
    }
  }

  onMount(async () => {
    setupAutosize()

    await loadPreview(mediaItem)

    return teardownAutosize
  })
</script>

<li class="compose-media compose-media-realm-{realm}" aria-label={shortName}>
  <img
          alt=""
          class="{type === 'audio' ? 'audio-preview' : ''}"
          style="object-position: {objectPosition};"
          src={preview}
          aria-hidden="true"
  />
  <div class="compose-media-buttons">
    <button class="compose-media-button compose-media-focal-button"
            aria-label="{intl.edit}"
            title="{intl.edit}"
            on:click="{onEdit}">
      <SvgIcon className="compose-media-button-svg" href="#fa-pencil"/>
    </button>
    <button class="compose-media-button compose-media-delete-button"
            aria-label="{intl.delete}"
            title="{intl.delete}"
            on:click="{onDeleteMedia}">
      <SvgIcon className="compose-media-button-svg" href="#fa-times"/>
    </button>
  </div>
  <div class="compose-media-alt">
    <textarea id="compose-media-input-{uuid}"
              class="compose-media-alt-input"
              placeholder="{intl.description}"
              bind:this={textarea}
              bind:value={rawText}
    ></textarea>
    <label for="compose-media-input-{uuid}" class="sr-only">
      {intl.descriptionLabel}
    </label>
  </div>
</li>
<style>
  .compose-media {
    margin: 0;
    padding: 0;
    height: 200px;
    overflow: hidden;
    flex-direction: column;
    position: relative;
    display: flex;
    background: var(--main-bg);
  }

  .compose-media img {
    object-fit: contain;
    flex: 1;
    height: 100%;
    width: 100%;
  }

  .compose-media-alt {
    z-index: 10;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }

  .compose-media-alt-input {
    width: 100%;
    font-size: 1.2em;
    background: var(--alt-input-bg);
    color: var(--body-text-color);
    max-height: 100px;
    border: 1px solid var(--input-border);
    resize: none;
  }

  .compose-media-alt-input:focus {
    background: var(--main-bg);
  }

  .compose-media-buttons {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    margin: 2px;
  }

  .compose-media-button {
    padding: 7px 10px 5px;
    background: var(--floating-button-bg);
    border: 1px solid var(--button-border);
  }

  .compose-media-button:hover {
    background: var(--floating-button-bg-hover);
  }

  .compose-media-button:active {
    background: var(--floating-button-bg-active);
  }

  :global(.compose-media-button-svg) {
    fill: var(--button-text);
    width: 18px;
    height: 18px;
  }

  .audio-preview {
    background: var(--audio-bg);
  }

  .compose-media-realm-dialog {
    max-height: 20vh;
  }

  @media (max-width: 767px) {
    .compose-media-realm-dialog {
      max-height: 15vh;
    }

    .compose-media-alt-input {
      max-height: 7vh;
    }
  }

  @media (max-width: 320px) {
    .compose-media-realm-dialog .compose-media-alt-input {
      display: none; /* too small to show this - use the edit button instead */
    }
  }
</style>