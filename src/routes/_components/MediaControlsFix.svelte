<script>
  import { FOCUSABLE_ELEMENTS_QUERY } from '../_thirdparty/a11y-dialog/a11y-dialog'
  import { documentKeydown } from '../_utils/events'

  let tabKeyHadShift = undefined

  function onDocumentKeydown(event) {
    if (event.key === 'Tab') {
      tabKeyHadShift = !!event.shiftKey
    }
  }

  function onFocus() {
    const modal = document.querySelector('.modal-dialog-contents')
    if (tabKeyHadShift) {
      // user typed Shift-Tab
      // focus the last element in the modal dialog which is not this element.
      // This _should_ be the last element inside of the video/audio controls, but it's not possible
      // to target these shadow elements, so just target the whole video/audio controls.
      const elements = modal.querySelectorAll(FOCUSABLE_ELEMENTS_QUERY)
      elements[elements.length - 2].focus()
    } else {
      // user typed Tab
      // focus the first element in the modal dialog, which should be the X (close) button
      modal.querySelector(FOCUSABLE_ELEMENTS_QUERY).focus()
    }
  }
</script>

<!--
  Nasty hack for video/audio with controls in dialogs. Audio/video controls in a dialog
  can't work probably with tab focusing per aria-practices guidelines, so we add
  an extra focusable element after the video/audio element that just loops focus back around
  to the beginning of the dialog.
  Things that are impossible to fix, however:
    - Shift-Tab cycling to the last element inside the video/audio shadow
    - Pressing Esc while inside the video/audio shadow closes the dialog
  See: https://github.com/w3c/aria-practices/issues/1772
-->
<div
  class="media-controls-fix"
  on:focus={onFocus}
  use:documentKeydown={onDocumentKeydown}
  aria-hidden="true"
  tabindex="0"
/>

<style>
  .media-controls-fix {
    width: 1px;
    height: 1px;
    pointer-events: none;
    position: absolute;
  }
</style>
