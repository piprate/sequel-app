<script>
  import { currentInstance, setComposeData } from '../../_store/local'
  import {
    autosuggestSearchResults,
    autosuggestSelected,
    autosuggestShown,
    autosuggestType,
    currentComposeRealm,
    rootAutosuggestSearchResults,
    rootAutosuggestSelected,
    rootAutosuggestSelecting,
    rootComposeFocused,
    rootComposeSelectionStart,
    setForCurrentAutosuggest
  } from '../../_store/autosuggest'
  import { autosize } from '../../_thirdparty/autosize/autosize'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { mark, stop } from '../../_utils/marks'
  import { selectionChange } from '../../_utils/events'
  import {
    clickSelectedAutosuggestionName,
    clickSelectedAutosuggestionEmoji,
    clickSelectedAutosuggestionHashtag,
    updateMentions
  } from '../../_actions/autosuggest'
  import { get } from '../../_utils/lodash-lite'
  import { on } from '../../_utils/eventBus'
  import { requestPostAnimationFrame } from '../../_utils/requestPostAnimationFrame'
  import { throttleTimer } from '../../_utils/throttleTimer'
  import { isWebKit } from '../../_utils/userAgent/isWebKit'
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  const updateComposeTextInStore = throttleTimer(scheduleIdleTask)

  export let realm
  export let text
  export let autoFocus

  let rawText = ''
  let textarea
  let selectedItem

  $: realmComposeFocused = get($rootComposeFocused, [$currentInstance, realm], false)
  $: autosuggestShownForThisInput = !!($autosuggestShown && realmComposeFocused)
  $: realmAutosuggestSelected = $autosuggestSelected
  $: activeDescendant = autosuggestShownForThisInput
    ? `compose-autosuggest-active-item-${realm}-${realmAutosuggestSelected}`
    : undefined
  $: {
    const suggestions = $autosuggestSearchResults

    if (suggestions.length) {
      selectedItem = suggestions[$autosuggestSelected]
    }
  }

  let firstTime = true

  function observeText(text) {
    if (rawText !== text) {
      let newSelectionStart
      if (!firstTime) {
        const { selectionStart, selectionEnd } = textarea
        if (selectionStart > 0 && selectionStart === selectionEnd) {
          // Preserve cursor position when doing an autosuggest.
          // Note that we don't need to do anything special to measure length here, because
          // the selectionStart value is not emoji-aware.
          newSelectionStart = text.length - rawText.length + selectionStart
        }
      }
      rawText = text
      if (typeof newSelectionStart === 'number' && newSelectionStart > 0) {
        textarea.selectionStart = textarea.selectionEnd = newSelectionStart
      }
      // this next autosize is required to resize after
      // the user clicks the "toot" button
      mark('autosize.update()')
      autosize.update(textarea)
      stop('autosize.update()')
    }
    if (firstTime) {
      firstTime = false
      if (autoFocus) {
        requestAnimationFrame(() => textarea.focus({ preventScroll: true }))
      }
    }
  }

  $: observeText(text)

  function observeRawText(rawText) {
    updateComposeTextInStore(() => {
      mark('updateComposeTextInStore')
      setComposeData(realm, { text: rawText })
      stop('updateComposeTextInStore')
    })
  }

  $: observeRawText(rawText)

  function setupSyncFromStore() {
    // let firstTime = true
    // this.observe('text', text => {
    //   if (rawText !== text) {
    //     let newSelectionStart
    //     if (!firstTime) {
    //       const { selectionStart, selectionEnd } = textarea
    //       if (selectionStart > 0 && selectionStart === selectionEnd) {
    //         // Preserve cursor position when doing an autosuggest.
    //         // Note that we don't need to do anything special to measure length here, because
    //         // the selectionStart value is not emoji-aware.
    //         newSelectionStart = (text.length - rawText.length) + selectionStart
    //       }
    //     }
    //     this.set({ rawText: text })
    //     if (typeof newSelectionStart === 'number' && newSelectionStart > 0) {
    //       textarea.selectionStart = textarea.selectionEnd = newSelectionStart
    //     }
    //     // this next autosize is required to resize after
    //     // the user clicks the "toot" button
    //     mark('autosize.update()')
    //     autosize.update(textarea)
    //     stop('autosize.update()')
    //   }
    //   if (firstTime) {
    //     firstTime = false
    //     if (autoFocus) {
    //       requestAnimationFrame(() => textarea.focus({ preventScroll: true }))
    //     }
    //   }
    // })
  }

  function setupSyncToStore() {
    // this.observe('rawText', rawText => {
    //   updateComposeTextInStore(() => {
    //     mark('updateComposeTextInStore')
    //     setComposeData(realm, { text: rawText })
    //     stop('updateComposeTextInStore')
    //   })
    // }, { init: false })
  }

  function setupAutosize() {
    requestPostAnimationFrame(() => {
      mark('autosize()')
      autosize(textarea)
      stop('autosize()')
    })
  }

  function teardownAutosize() {
    mark('autosize.destroy()')
    autosize.destroy(textarea)
    stop('autosize.destroy()')
  }

  function onBlur() {
    requestAnimationFrame(() => {
      setForCurrentAutosuggest(rootComposeFocused, false)
    })
  }

  function onFocus() {
    scheduleIdleTask(() => {
      currentComposeRealm.set(realm)
      setForCurrentAutosuggest(rootComposeFocused, true)
    })
  }

  function onSelectionChange(selectionStart) {
    scheduleIdleTask(() => {
      setForCurrentAutosuggest(rootComposeSelectionStart, selectionStart)
    })
  }

  function onKeydown(e) {
    const { keyCode } = e
    // ctrl or cmd (on macs) was pressed; ctrl-enter means post a toot
    const ctrlPressed = e.getModifierState('Control') || e.getModifierState('Meta')
    switch (keyCode) {
      case 9: {
        // tab
        clickSelectedAutosuggestion(e)
        break
      }
      case 13: {
        // enter
        const autosuggestionClicked = clickSelectedAutosuggestion(e)
        if (!autosuggestionClicked && ctrlPressed) {
          dispatch('publishAction')
        }
        break
      }
      case 38: {
        // up
        incrementAutosuggestSelected(-1, e)
        break
      }
      case 40: {
        // down
        incrementAutosuggestSelected(1, e)
        break
      }
      case 27: {
        // escape
        clearAutosuggestions(e)
        break
      }
      default:
    }
  }

  function clickSelectedAutosuggestion(event) {
    if (!$autosuggestShown) {
      return false
    }
    event.preventDefault()
    event.stopPropagation()

    const clickAutosuggestedItem = async () => {
      /* autosuggestSelecting prevents a flash of searched content */
      setForCurrentAutosuggest(rootAutosuggestSelecting, true)
      if ($autosuggestType === 'spark') {
        await clickSelectedAutosuggestionName(realm)
      } else if ($autosuggestType === 'hashtag') {
        await clickSelectedAutosuggestionHashtag(realm)
      } else {
        // emoji
        await clickSelectedAutosuggestionEmoji(realm)
      }

      updateMentions(selectedItem, realm)

      setForCurrentAutosuggest(rootAutosuggestSelecting, false)
    }

    /* no await */ clickAutosuggestedItem()
    return true
  }

  function incrementAutosuggestSelected(increment, event) {
    if (!$autosuggestShown) {
      return
    }
    let selected = $autosuggestSelected
    const searchResultsLength = $autosuggestSearchResults.length
    selected += increment
    if (selected >= 0) {
      selected = selected % searchResultsLength
    } else {
      selected = searchResultsLength + selected
    }
    setForCurrentAutosuggest(rootAutosuggestSelected, selected)
    event.preventDefault()
    event.stopPropagation()
  }

  function clearAutosuggestions(event) {
    if (!$autosuggestShown) {
      return
    }
    setForCurrentAutosuggest(rootAutosuggestSearchResults, [])
    setForCurrentAutosuggest(rootAutosuggestSelected, 0)
    event.preventDefault()
    event.stopPropagation()
  }

  function setupResize() {
    on('resizeComposeInput', (_realm) => {
      if (_realm === realm) {
        autosize.update(textarea)
      }
    })
  }

  function setCursorIfNecessary() {
    if (isWebKit() && realm !== 'dialog' && realm !== 'home') {
      // Place the cursor at the end of the textarea in replies if this is WebKit.
      // Works around a Safari/WebKit bug.
      // We only do this for replies (not dialog/home) because for dialog/home we don't want to
      // also focus the textarea, which is a side effect of setting selectionStart.
      // Potentially we could run this logic for all browsers, but I don't want to deal with the potential
      // perf hit or bugs of running more code for browsers that don't need it.
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.value.length
      })
    }
  }

  onMount(() => {
    setupSyncFromStore()
    setupSyncToStore()
    setupAutosize()
    setupResize()
    setCursorIfNecessary()
    return () => {
      teardownAutosize()
    }
  })
</script>

<textarea
  id="the-compose-box-input-{realm}"
  class="compose-box-input compose-box-input-realm-{realm}"
  placeholder={intl.composeLabel}
  aria-describedby="compose-box-input-description-{realm}"
  aria-owns="compose-autosuggest-list-{realm}"
  aria-expanded={autosuggestShownForThisInput}
  aria-autocomplete="both"
  aria-activedescendant={activeDescendant}
  bind:this={textarea}
  bind:value={rawText}
  use:selectionChange={onSelectionChange}
  on:focus={onFocus}
  on:blur={onBlur}
  on:keydown={onKeydown}
/>
<label for="the-compose-box-input-{realm}" class="sr-only">
  {intl.composeLabel}
</label>
<span id="compose-box-input-description-{realm}" class="sr-only">
  {intl.autocompleteDescription}
</span>

<style>
  .compose-box-input {
    grid-area: input;
    margin: 10px 0 0 5px;
    padding: 10px;
    border: 1px solid var(--input-border);
    min-height: 75px;
    resize: none;
    overflow: hidden;
    word-wrap: break-word;
    /* Text must be at least 16px or else iOS Safari zooms in */
    font-size: 1.2em;
    /* Hack to make Edge stretch the element all the way to the right.
     * Also desktop Safari makes the gauge stretch too far to the right without it.
     */
    width: calc(100% - 5px);
  }

  .compose-box-input-realm-dialog {
    max-height: 40vh;
    overflow-y: auto;
  }

  @media (max-width: 767px) {
    .compose-box-input-realm-dialog {
      max-height: 30vh;
    }
  }

  @media (max-width: 479px) {
    .compose-box-input-realm-dialog {
      max-height: 20vh;
    }
  }
</style>
