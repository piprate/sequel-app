<script>
  import {
    isVisible,
    firstVisibleElementIndex,
    scrollIntoViewIfNeeded
} from '../../_utils/scrollIntoView'
  import {
    addShortcutFallback,
    removeShortcutFallback,
    onKeyDownInShortcutScope
} from '../../_utils/shortcuts'
  import { smoothScroll } from '../../_utils/smoothScroll'
  import { getScrollContainer } from '../../_utils/scrollContainer'
  import { currentTimeline } from '../../_store/local'
  import { emit } from '../../_utils/eventBus'
  import {onMount} from "svelte";

  const VISIBILITY_CHECK_DELAY_MS = 600

  const keyToElement = key => document.getElementById(key)
  const elementToKey = element => element.getAttribute('id')
  const scope = 'global'

  const shouldIgnoreEvent = event => {
    // For accessibility reasons, do not override the arrowup/arrowdown behavior for radio buttons
    // (e.g. in a poll). Up/down is supposed to change the radio value, not the current post.
    const { target, key } = event
    const isRadio = target &&
    target.tagName === 'INPUT' &&
    target.type === 'radio'
    const isArrow = key === 'ArrowUp' || key === 'ArrowDown'
    return isRadio && isArrow
  }

  let activeItemChangeTime = 0;
  let elements = document.getElementsByClassName('shortcut-list-item');
  let spoilersShown = false;

  let __this = {
    onKeyDown: function (event) {
      if (shouldIgnoreEvent(event)) {
        return
      }
      if (event.key === 'z' && $currentTimeline.startsWith('post/')) {
        // if we're in a thread, toggle all content warnings on or off
        event.stopPropagation()
        event.preventDefault()
        emit('toggleAllSpoilers', !spoilersShown)
        spoilersShown = !spoilersShown;
        return
      }
      if (event.key === 'j' || event.key === 'ArrowDown') {
        event.stopPropagation()
        event.preventDefault()
        changeActiveItem(1, event.timeStamp)
        return
      }
      if (event.key === 'k' || event.key === 'ArrowUp') {
        event.stopPropagation()
        event.preventDefault()
        changeActiveItem(-1, event.timeStamp)
        return
      }
      let activeItemKey = checkActiveItem(event.timeStamp)
      if (!activeItemKey) {
        const index = firstVisibleElementIndex(elements).first
        if (index >= 0) {
          activeItemKey = elementToKey(elements[index])
        }
      }
      if (activeItemKey) {
        onKeyDownInShortcutScope(activeItemKey, event)
      }
    }
  };

  function changeActiveItem(movement, timeStamp) {
    let index = -1
    let activeItemKey = checkActiveItem(timeStamp)
    if (activeItemKey) {
      const len = elements.length
      let i = -1
      while (++i < len) {
        if (elementToKey(elements[i]) === activeItemKey) {
          index = i
          break
        }
      }
    }
    if (index === 0 && movement === -1) {
      activeItemKey = null
      // Where is this used? this.set({ activeItemKey })
      smoothScroll(getScrollContainer(), 0, /* horizontal */ false, /* preferFast */ false)
      return
    }
    if (index === -1) {
      const { first, firstComplete } = firstVisibleElementIndex(elements)
      index = (movement > 0) ? firstComplete : first
    } else {
      index += movement
    }
    if (index >= 0 && index < elements.length) {
      activeItemKey = elementToKey(elements[index])
      setActiveItem(activeItemKey, timeStamp)
      scrollIntoViewIfNeeded(keyToElement(activeItemKey))
    }
  }

  function checkActiveItem(timeStamp) {
    const activeElement = document.activeElement
    if (!activeElement) {
      return null
    }
    const activeItem = activeElement.getAttribute('id')
    if (!activeItem) {
      return null
    }
    if ((timeStamp - activeItemChangeTime) > VISIBILITY_CHECK_DELAY_MS &&
      !isVisible(keyToElement(activeItem))) {
      setActiveItem(null, 0)
      return null
    }
    return activeItem
  }

  function setActiveItem(key, timeStamp) {
    activeItemChangeTime = timeStamp;
    try {
      keyToElement(key).focus({
        preventScroll: true
      })
    } catch (err) {
      console.error('Ignored focus error', err)
    }
  }

  onMount(() => {
    addShortcutFallback(scope, __this);
    return () => {
      removeShortcutFallback(scope, __this);
    }
  });
</script>
