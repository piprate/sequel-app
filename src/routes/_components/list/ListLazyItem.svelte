<script>
  import ListItem from './ListItem.svelte'
  import { mark, stop } from '../../_utils/marks'
  import { createEventDispatcher, onMount } from "svelte";
  import { on } from '../../_utils/eventBus';

  export let component;
  export let index;
  export let length;
  export let makeProps;
  export let key;

  const dispatch = createEventDispatcher();

  let props = undefined;

  async function fetchProps () {
    if (makeProps) {
      props = await makeProps(key);
      mark('ListLazyItem set props');
      stop('ListLazyItem set props');
    }
  }

  onMount(async () => {
    fetchProps()
    return on('postUpdated', fetchProps);
  });
</script>

{#if props}
  <ListItem
          {component}
          {props}
          {key}
          {index}
          {length}
          on:initialized
  />
{/if}