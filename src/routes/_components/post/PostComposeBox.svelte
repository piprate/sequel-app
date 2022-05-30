<script>
  import ComposeBox from '../compose/ComposeBox.svelte'
  import { repliesShown, setComposeData } from '../../_store/local'
  import { currentComposeData } from '../../_store/instance'
  import debounce from 'lodash-es/debounce'
  import throttle from 'lodash-es/throttle'
  import { on } from '../../_utils/eventBus'
  import { createEventDispatcher, onMount } from 'svelte'

  const DEBOUNCE_DELAY = 400
  const THROTTLE_DELAY = 150

  const dispatch = createEventDispatcher()

  export let bubbleId
  export let originalPostId
  export let visibility
  export let spoilerText
  export let uuid

  $: composeData = $currentComposeData[originalPostId] || {}

  function onPublishedPost (realm) {
    if (realm !== originalPostId) {
      return
    }
    requestAnimationFrame(() => {
      $repliesShown[uuid] = false
      dispatch('recalculateHeight')
    })
  }

  let composeDataObserver
  $: if (composeDataObserver) {
    composeDataObserver(composeData)
  }

  function setupRecalculateHeightListener () {
    const recalc = () => requestAnimationFrame(() => dispatch('recalculateHeight'))
    // debounce AND throttle due to 333ms content warning animation
    const debounced = debounce(recalc, DEBOUNCE_DELAY)
    composeDataObserver = throttle(() => {
      debounced()
      recalc()
    }, THROTTLE_DELAY, {
      leading: true,
      trailing: true
    })
  }

  onMount(() => {
    setComposeData(originalPostId, { inReplyToId: originalPostId })
    const removeListener = on('publishedPost', onPublishedPost)
    setupRecalculateHeightListener()
    return removeListener
  })
</script>

<div class="post-article-compose-box">
  <ComposeBox realm={originalPostId}
              autoFocus="true"
              hideBottomBorder="true"
              isReply="true"
              bubbleId={bubbleId}
              replyVisibility={visibility}
              replySpoiler={spoilerText}
              inReplyToUuid={uuid}
  />
</div>
<style>
  .post-article-compose-box {
    grid-area: compose;
    max-width: 100%;
  }
</style>