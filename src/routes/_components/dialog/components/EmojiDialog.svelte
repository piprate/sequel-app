<script>
  import ModalDialog from './ModalDialog.svelte'
  import { autoplayGifs, enableGrayscale, isUserTouching, selectedTheme } from '../../../_store/local'
  import { currentCustomEmoji } from '../../../_store/instance'
  import { insertEmoji } from '../../../_actions/emoji'
  import { close } from '../helpers/closeDialog'
  import { isDarkTheme } from '../../../_utils/isDarkTheme'
  import 'emoji-picker-element/picker'
  import { registerShadowRoot, unregisterShadowRoot } from '../../../_thirdparty/a11y-dialog/a11y-dialog'
  import { doubleRAF } from '../../../_utils/doubleRAF'
  import { convertCustomEmojiToEmojiPickerFormat } from '../../../_utils/convertCustomEmojiToEmojiPickerFormat'
  import { supportsFocusVisible } from '../../../_utils/supportsFocusVisible'
  import { importFocusVisible } from '../../../_utils/polyfills/asyncPolyfills'
  import { getEmojiPickerI18n, emojiPickerDataSource, emojiPickerLocale } from '../../../_static/emojiPickerIntl'
  import { onMount } from 'svelte'

  export let id
  export let label
  export let title
  export let realm

  $: darkMode = isDarkTheme($selectedTheme)
  $: customEmoji = convertCustomEmojiToEmojiPickerFormat($currentCustomEmoji, $autoplayGifs)

  let picker

  function onEmojiSelected(event) {
    insertEmoji(realm, event.detail.emoji)
    close(id)
  }

  function onPickerKeydown(event) {
    // workaround for shortcuts -- see acceptShortcutEvent() in shortcuts.js
    if (
      event.key === 'Backspace' &&
      event.target.shadowRoot.activeElement &&
      event.target.shadowRoot.activeElement.tagName === 'INPUT'
    ) {
      event.stopPropagation() // prevent our hotkeys from activating when pressing backspace in the input
    }
  }

  onMount(async () => {
    picker.customEmoji = customEmoji
    const emojiPickerI18n = await getEmojiPickerI18n()

    if (emojiPickerI18n) {
      picker.i18n = emojiPickerI18n
    }
    // break into shadow DOM to fix grayscale in Wellness grayscale mode
    if ($enableGrayscale) {
      const style = document.createElement('style')
      style.textContent = '.emoji { filter: grayscale(100%); }'
      picker.shadowRoot.appendChild(style)
    }
    registerShadowRoot(picker.shadowRoot)
    if (!$isUserTouching) {
      // auto focus the input on desktop
      doubleRAF(() => {
        // triple rAF because a11y tries to focus as well
        requestAnimationFrame(() => {
          picker.shadowRoot.querySelector('input').focus()
        })
      })
    }
    if (!supportsFocusVisible()) {
      await importFocusVisible()
      /* global applyFocusVisiblePolyfill */
      applyFocusVisiblePolyfill(picker.shadowRoot)
    }
    return () => {
      unregisterShadowRoot(picker.shadowRoot)
    }
  })
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={true} background="var(--main-bg)">
  <div class="emoji-container">
    <emoji-picker
      bind:this={picker}
      locale={emojiPickerLocale}
      data-source={emojiPickerDataSource}
      class={darkMode ? 'dark' : 'light'}
      on:emoji-click={onEmojiSelected}
      on:keydown={onPickerKeydown}
    />
  </div>
</ModalDialog>

<style>
  emoji-picker {
    --indicator-color: var(--main-theme-color);
    --outline-color: var(--focus-outline);
  }

  @media (max-width: 479px) {
    .emoji-container,
    emoji-picker {
      width: 100%;
    }
  }

  @media (max-width: 320px) {
    emoji-picker {
      --emoji-padding: 0.25rem;
      --input-padding: 0.125rem;
    }
    emoji-picker {
      --num-columns: 6;
    }
  }

  @media (max-width: 240px) {
    emoji-picker {
      --num-columns: 6;
      --emoji-size: 1.125rem;
      --emoji-padding: 0.125rem;
      height: 240px;
    }
  }

  @media (max-height: 450px) {
    emoji-picker {
      height: calc(100vh - 75px); /* leave room for the dialog bar */
    }
  }
</style>
