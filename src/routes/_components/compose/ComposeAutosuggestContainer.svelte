<script>
  import { composeData, currentInstance } from '../../_store/local'
  import {
    rootAutosuggestSearchResults,
    rootAutosuggestSelected,
    autosuggestShown,
    rootAutosuggestType,
    rootAutosuggestSelecting,
    rootComposeFocused,
    setForCurrentAutosuggest
  } from '../../_store/autosuggest'
  import ComposeAutosuggestionList from './ComposeAutosuggestionList.svelte'
  import { get } from '../../_utils/lodash-lite'
  import { selectAutosuggestItem, updateMentions } from '../../_actions/autosuggest'
  import { once } from '../../_utils/once'
  import { onMount } from "svelte";
  import { emit } from "../../_utils/eventBus";

  export let realm;
  export let left;
  export let top = 0;

  let shown = false;
  $: mentions = get($composeData, [$currentInstance, realm, 'mentions'], [])
  $: realmComposeFocused = get($rootComposeFocused, [$currentInstance, realm], false);
  $: realmAutosuggestSearchResults = get($rootAutosuggestSearchResults, [$currentInstance, realm], []);
  $: realmAutosuggestType = get($rootAutosuggestType, [$currentInstance, realm]);
  $: realmAutosuggestSelected = get($rootAutosuggestSelected, [$currentInstance, realm], 0);
  $: shouldBeShown = !!($autosuggestShown && realmComposeFocused);

  function onClick (event) {
    /* autosuggestSelecting prevents a flash of searched content */
    setForCurrentAutosuggest(rootAutosuggestSelecting, true);
    emit('autosuggestItemSelected');
    selectAutosuggestItem(event.detail);

    const item = event.detail

    updateMentions(item, realm)

    const composeInput = document.getElementById(`the-compose-box-input-${realm}`)
    composeInput?.focus()
  }

  let _promiseChain;

  let observeShouldBeShownEnabled = false;

  function observeShouldBeShown(shouldBeShown) {
    // TODO: hack so that when the user clicks the button, and the textarea blurs,
    // we don't immediately hide the dropdown which would cause the click to get lost
    _promiseChain = _promiseChain.then(() => {
      if (!shouldBeShown) {
        return Promise.race([
          new Promise(resolve => setTimeout(resolve, 200)),
          new Promise(resolve => once('autosuggestItemSelected', resolve))
        ])
      }
    }).then(() => {
      shown = shouldBeShown;
      setForCurrentAutosuggest(rootAutosuggestSelecting, false);
    })
  }
  $: if (observeShouldBeShownEnabled) {
    observeShouldBeShown(shouldBeShown);
  }

  onMount(() => {
    _promiseChain = Promise.resolve()
    observeShouldBeShownEnabled = true;
  });
</script>

<div class="compose-autosuggest {shown ? '' : 'not-shown'} {realm === 'dialog' ? 'is-dialog' : ''}"
     style="top: {top}px; --autosuggest-input-left: {left}px;"
>
  <ComposeAutosuggestionList
          items={realmAutosuggestSearchResults}
          on:click="{onClick}"
          type={realmAutosuggestType}
          selected={realmAutosuggestSelected}
          {realm}
  />
</div>
<style>
  .compose-autosuggest {
    position: absolute;
    z-index: 90;
    --autosuggest-input-left: 0; /* overridden by "left" prop passed in */
    --autosuggest-left-offset: 5px;
    /* In desktop mode, the autosuggest tracks the position of the input (the "left" prop passed in). */
    left: calc(var(--autosuggest-input-left) + var(--autosuggest-left-offset));
  }
  .compose-autosuggest.not-shown {
    display: none;
  }

  /* desktop styles */
  @media (min-width: 480px) {
    .compose-autosuggest {
      min-width: 400px;
      max-width: calc(100% - 20px);
    }
  }

  /* mobile size */
  @media (max-width: 479px) {
    .compose-autosuggest {
      /* on mobile, make it fill the viewport width */
      --autosuggest-left-offset: 10px;
      left: var(--autosuggest-left-offset);
      width: calc(100vw - (2 * var(--autosuggest-left-offset)));
    }
  }

  /* tiny mobile size */
  @media (max-width: 240px) {
    .compose-autosuggest {
      --autosuggest-left-offset: 5px; /* make it bigger on tiny devices */
    }
    .compose-autosuggest.is-dialog {
      --autosuggest-left-offset: 10px; /* more padding in dialogs */
    }
  }

</style>