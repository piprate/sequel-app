<script>
  import MediaAttachments from './MediaAttachments.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import SvgIcon from '../SvgIcon.svelte'
  import {
    largeInlineMedia,
    markMediaAsSensitive,
    neverMarkMediaAsSensitive,
    sensitivesShown
  } from '../../_store/local'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { classname } from '../../_utils/classname'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog'
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  export let uuid
  export let enableShortcuts
  export let shortcutScope
  export let post

  let hideSensitiveMedia
  let showSensitiveMedia

  $: computedClass = classname(
          'post-sensitive-media-container',
          sensitiveShown ? 'post-sensitive-media-shown' : 'post-sensitive-media-hidden',
          oddCols && 'odd-cols',
          twoCols && 'two-cols',
          $largeInlineMedia ? 'not-grouped-images' : 'grouped-images'
  )
  $: mediaAttachments = post.media
  $: sensitiveShown = !!$sensitivesShown[uuid]
  $: sensitive = (
          !$neverMarkMediaAsSensitive && ($markMediaAsSensitive || post.sensitive)
  )
  $: elementId = `sensitive-${uuid}`
  $: customSize = (() => {
    if ($largeInlineMedia || !mediaAttachments || mediaAttachments.length < 5) {
      return ''
    }
    return `padding-bottom: ${Math.ceil(mediaAttachments.length / 2) * 29}%;`
  })()
  $: nCols = (!$largeInlineMedia && mediaAttachments.length > 1) ? 2 : 1
  $: oddCols = (mediaAttachments.length > 1 && (mediaAttachments.length % 2))
  $: twoCols = (mediaAttachments.length === 2)

  async function showFirstMedia () {
    const showMediaDialog = await importShowMediaDialog()
    showMediaDialog(mediaAttachments, 0)
  }

  function toggleSensitiveMedia (changeFocus) {
    $sensitivesShown[uuid] = !sensitivesShown[uuid]
    dispatch('recalculateHeight')
    // Only change focus for clicks, not for hotkeys. It's weird if, when the entire toot
    // is focused and you press "y", that the focus changes to the sensitive media button.
    if (changeFocus) {
      requestAnimationFrame(() => {
        const element = hideSensitiveMedia || showSensitiveMedia
        try {
          element.focus({ preventScroll: true })
        } catch (e) {
          console.error('ignored focus error', e)
        }
      })
    }
    return true
  }

  onMount(() => {
    return registerClickDelegate(elementId, () => toggleSensitiveMedia(true))
  })
</script>

{#if sensitive }
<div class={computedClass} style={customSize}>
  <div class="post-sensitive-inner-div">
    {#if sensitiveShown}
      <button id={elementId}
              type="button"
              class="post-sensitive-media-button"
              aria-label="{intl.hideSensitiveMedia}"
              bind:this={hideSensitiveMedia}
      >
        <div class="svg-wrapper">
          <SvgIcon className="post-sensitive-media-svg"
                   href="#fa-eye-slash" />
        </div>
      </button>
    {:else}
      <button id={elementId}
              type="button"
              class="post-sensitive-media-button"
              aria-label="{intl.showSensitiveMedia}"
              bind:this={showSensitiveMedia}
      >

        <div class="post-sensitive-media-warning">
          <div class="post-sensitive-media-warning-text">
            {intl.clickToShowSensitive}
          </div>
        </div>
        <div class="svg-wrapper">
          <SvgIcon className="post-sensitive-media-svg" href="#fa-eye" />
        </div>
      </button>
    {/if}
    <MediaAttachments {mediaAttachments} {sensitive} {sensitiveShown} {uuid} />
  </div>
</div>
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="y" on:pressed="{ () => toggleSensitiveMedia(false) }"/>
{/if}
{:else}
  <MediaAttachments {mediaAttachments} {sensitive} {sensitiveShown} {uuid} />
{/if}
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="i" on:pressed="{showFirstMedia}" />
{/if}
<style>
  .post-sensitive-media-container {
    grid-area: media;
    width: 100%;
    margin: 10px 0;
    position: relative;
    border-radius: 0;
    border: none;
    background: none;
  }

  .post-sensitive-inner-div {
    height: 100%;
  }

  .post-sensitive-media-container.grouped-images .post-sensitive-inner-div {
    position: relative;
    width: 100%;
  }

  .post-sensitive-media-container.grouped-images {
    grid-area: media-grp;
  }

  .post-sensitive-media-button {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
  }

  .post-sensitive-media-button:hover {
    background: none;
  }

  .post-sensitive-media-button:active {
    background: none;
  }

  .post-sensitive-media-shown .post-sensitive-media-button {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 90;
  }

  .post-sensitive-media-hidden .post-sensitive-media-button {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .post-sensitive-media-container.post-sensitive-media-hidden {
    width: 100%;
    margin: 10px auto;
  }
  .post-sensitive-media-container.post-sensitive-media-hidden.not-grouped-images {
      height: 250px;
  }

  .post-sensitive-media-container .post-sensitive-media-warning {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--deemphasized-text-color);
    z-index: 60;
    padding: 0 10px;
    position: absolute;
  }

  .post-sensitive-media-container .post-sensitive-media-warning .post-sensitive-media-warning-text {
    background: var(--mask-bg);
    padding: 10px;
    border-radius: 6px;
    color: var(--blurhash-sensitive-text-color);
  }

  .post-sensitive-media-container .svg-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    z-index: 40;
    pointer-events: none;
    background: var(--mask-bg);
  }
  .post-sensitive-media-hidden .svg-wrapper {
    position: absolute;
    background: none;
    top: 5px;
    left: 5px;
    right: 0;
    bottom: 0;
  }

  .post-sensitive-media-container.grouped-images .svg-wrapper {
    border-radius: 6px;
  }
  .post-sensitive-media-container.post-sensitive-media-shown .svg-wrapper {
    background: none;
  }
  :global(.post-sensitive-media-svg) {
    width: 24px;
    height: 24px;
    fill: var(--mask-svg-fill);
    border-radius: 2px;
    background: var(--mask-opaque-bg);
    margin: 5px;
    padding: 6px 10px;
  }
  :global(.post-sensitive-media-container.post-sensitive-media-hidden .post-sensitive-media-svg) {
    fill: var(--blurhash-sensitive-text-color);
    background: var(--mask-bg);
  }
</style>
