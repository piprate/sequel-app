<script>
  import ComposeAutosuggestContainer from './ComposeAutosuggestContainer.svelte'
  import { requestPostAnimationFrame } from '../../_utils/requestPostAnimationFrame'
  import { throttleTimer } from '../../_utils/throttleTimer'
  import { on } from '../../_utils/eventBus'
  import { currentInstance } from '../../_store/local'
  import { autosuggestShown, rootComposeFocused } from '../../_store/autosuggest'
  import { addScrollListener, getScrollContainer, removeScrollListener } from '../../_utils/scrollContainer'
  import { get } from '../../_utils/lodash-lite'
  import { registerResizeListener, unregisterResizeListener } from '../../_utils/resize'
  import {onMount} from "svelte";
  import { inBrowser } from '../../_utils/browserOrNode';

  const updatePosition = inBrowser() && throttleTimer(requestAnimationFrame)

  export let realm;
  //export let text;
  export let dialogId;

  let anchor;

  $: currentComposeFocused = get($rootComposeFocused, [$currentInstance, realm], false);
  $: shouldBeShown = !!($autosuggestShown && currentComposeFocused);

  let _element;
  let _autosuggest;

  const onResize = () => updatePosition(() => doResize());

  let enableShouldBeShownObserver = false;

  $: {
    if (enableShouldBeShownObserver) {
      if (shouldBeShown) {
        onResize() // just in case the window size changed while we weren't focused
      }
    }
  }

  function setup () {
    requestAnimationFrame(() => {
      const id = `the-autosuggest-container-${realm}`
      _element = document.getElementById(id)
      if (!_element) {
        _element = document.createElement('div')
        _element.id = id
        const parent = realm === 'dialog' ? document.querySelector('.modal-dialog-contents') : document.body
        parent.appendChild(_element) // write
      }
      requestPostAnimationFrame(() => {
        const { left, top } = calculateLeftAndTop()
        _autosuggest = new ComposeAutosuggestContainer({
          target: _element,
          props: {
            realm,
            // text,
            // dialogId,
            left,
            top
          }
        })
        // this.observe('text', text => {
        //   _autosuggest.set({ text })
        // }, { init: false })
        // this.observe('shouldBeShown', shouldBeShown => {
        //   if (shouldBeShown) {
        //     onResize() // just in case the window size changed while we weren't focused
        //   }
        // })
        enableShouldBeShownObserver = true;

        registerResizeListener(onResize);
        addScrollListener(onResize);
      })
    })
  }

  function doResize () {
    if (_autosuggest && shouldBeShown) {
      const { left, top } = calculateLeftAndTop()
      console.log('updating autosuggest position', { left, top })
      _autosuggest.$set({ left, top });
    }
  }

  function calculateLeftAndTop () {
    const { left, bottom } = anchor.getBoundingClientRect()
    const yOffset = realm === 'dialog' ? 0 : getScrollContainer().scrollTop
    return {
      left,
      top: bottom + yOffset
    }
  }

  onMount(() => {
    let setupDone = false
    if (realm === 'dialog') {
      // wait for dialog to render first
      on('dialogDidRender', id => {
        if (id === dialogId && !setupDone) {
          setupDone = true
          setup()
        }
      })
    } else {
      setupDone = true
      setup()
    }

    return () => {
      if (_autosuggest) {
        _autosuggest.$destroy();
        _autosuggest = null;
      }
      if (_element) {
        _element.remove()
      }
      unregisterResizeListener(onResize)
      removeScrollListener(onResize)
    }
  });
</script>

<div class="compose-autosuggest-anchor-point" bind:this={anchor}></div>
<style>
    .compose-autosuggest-anchor-point {
        grid-area: autosuggest;
        width: 100%;
        height: 0;
    }
</style>
