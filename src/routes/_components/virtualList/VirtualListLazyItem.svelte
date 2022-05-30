<script>
  import VirtualListItem from './VirtualListItem.svelte'
  import { mark, stop } from '../../_utils/marks'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { createPriorityQueue } from '../../_utils/createPriorityQueue'
  import { isMobile } from '../../_utils/userAgent/isMobile'
  import { reduceMotion } from '../../_store/local'
  import { onMount } from "svelte";

  // In Svelte's implementation of lists, these VirtualListLazyItems can be
  // created in any order. By default in fact it seems to do it in reverse
  // order, which we don't really want, because then items render in a janky
  // way, with the last ones first and then replaced by the first ones,
  // resulting in a UI that looks like a deck of cards being shuffled.
  // This functions waits a microtask and then ensures that the callbacks
  // are called by index, in ascending order.
  const priorityQueue = createPriorityQueue()

  export let component;
  export let offset;
  export let makeProps;
  export let key;
  export let index;

  let props = undefined;

  onMount(() => {
    if (makeProps) {
      // TODO: I would use async/await here, but Firefox 68 for Android has a bug where
      // these don't resolve in the proper order unless I use promises
      priorityQueue(index).then(async () => {
        const _props = await makeProps(key)
        const setProps = () => {
          mark('VirtualListLazyItem set props')
          props = _props;
          stop('VirtualListLazyItem set props')
        }
        // On desktop, if prefers-reduced-motion is enabled, avoid using scheduleIdleTask
        // here because it causes the scrollbar to grow in a way that may sicken
        // people with vestibular disorders.
        // TODO: someday we can use isInputPending as a better way to break up work
        // https://www.chromestatus.com/feature/5719830432841728
        if (!isMobile() && $reduceMotion) {
          setProps()
        } else {
          scheduleIdleTask(setProps)
        }
      })
    }
  });
</script>

{#if props}
  <VirtualListItem {component}
                   {offset}
                   {props}
                   {key}
                   {index}
  />
{/if}