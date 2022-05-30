<script>
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { mark, stop } from '../../_utils/marks'
  import { emojifyText } from '../../_utils/emojifyText'
  import { on } from '../../_utils/eventBus'
  import escapeHtml from 'escape-html'
  import { createEventDispatcher, onMount } from "svelte";
  import { autoplayGifs, spoilersShown } from '../../_store/local'

  const dispatch = createEventDispatcher();

  export let uuid;
  export let isStatusInNotification;
  export let isStatusInOwnThread;
  export let spoilerShown;
  export let enableShortcuts;
  export let shortcutScope;
  export let spoilerText;
  export let originalStatusEmojis;

  function toggleSpoilers(shown) {
    $spoilersShown[uuid] = typeof shown === 'undefined' ? !$spoilersShown[uuid] : !!shown
    requestAnimationFrame(() => {
      mark('clickSpoilerButton')
      dispatch('recalculateHeight')
      stop('clickSpoilerButton')
    })
    return true
  }

  $: massagedSpoilerText = (() => {
    spoilerText = escapeHtml(spoilerText)
    return emojifyText(spoilerText, originalStatusEmojis, $autoplayGifs)
  })();

  $: elementId = `spoiler-${uuid}`;

  onMount(() => {
    const removeListener = on('toggleAllSpoilers', toggleSpoilers);
    const unregister = registerClickDelegate(elementId, () => toggleSpoilers());
    return () => {
      unregister();
      removeListener();
    }
  });
</script>

<div class="status-spoiler {isStatusInNotification ? 'status-in-notification' : ''} {isStatusInOwnThread ? 'status-in-own-thread' : ''}">
  <p>{@html massagedSpoilerText}</p>
</div>
<div class="status-spoiler-button {isStatusInOwnThread ? 'status-in-own-thread' : ''}">
  <button id={elementId} type="button" >
    {spoilerShown ? 'intl.showLess' : 'intl.showMore'}
  </button>
</div>
{#if enableShortcuts}
<Shortcut scope={shortcutScope} key="x" on:pressed="{toggleSpoilers}"/>
{/if}
<style>
  .status-spoiler {
    grid-area: spoiler;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    font-size: 0.9em;
    margin: 10px 5px;
  }

  .status-spoiler.status-in-own-thread {
    font-size: 1.3em;
    margin: 20px 5px 10px;
  }

  .status-spoiler.status-in-notification {
    color: var(--very-deemphasized-text-color);
  }

  .status-spoiler-button {
    grid-area: spoiler-btn;
    margin: 10px 5px;
  }

  .status-spoiler-button.status-in-own-thread {
  }

  .status-spoiler-button button {
    padding: 5px 10px;
    font-size: 1.1em;
  }

  :global(.underline-links .status-spoiler a) {
    text-decoration: underline;
  }

</style>
