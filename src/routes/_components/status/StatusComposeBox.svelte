<script>
  import ComposeBox from '../compose/ComposeBox.svelte'
  import { repliesShown } from '../../_store/local'
  import { currentComposeData } from '../../_store/instance'
  import debounce from 'lodash-es/debounce'
  import throttle from 'lodash-es/throttle'
  import { on } from '../../_utils/eventBus'
  import { createEventDispatcher, onMount } from "svelte";

  const DEBOUNCE_DELAY = 400
  const THROTTLE_DELAY = 150

  const dispatch = createEventDispatcher();

  export let originalStatusId;
  export let visibility;
  export let spoilerText;
  export let uuid;

  $: composeData = $currentComposeData[originalStatusId] || {};

  function onPostedStatus (realm) {
    if (realm !== originalStatusId) {
      return
    }
    requestAnimationFrame(() => {
      $repliesShown[uuid] = false;
      dispatch('recalculateHeight');
    })
  }

  let composeDataObserver;
  $: if (composeDataObserver) {
    composeDataObserver(composeData);
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
    });
  }

  onMount(() => {
    const removeListener = on('postedStatus', onPostedStatus);
    setupRecalculateHeightListener();
    return removeListener;
  });
</script>

<div class="status-article-compose-box">
  <ComposeBox realm={originalStatusId}
              autoFocus="true"
              hideBottomBorder="true"
              isReply="true"
              replyVisibility={visibility}
              replySpoiler={spoilerText}
              inReplyToUuid={uuid}
  />
</div>
<style>
  .status-article-compose-box {
    grid-area: compose;
    max-width: 100%;
  }
</style>