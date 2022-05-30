<script>
  import ListItem from './ListItem.svelte'
  import { mark, stop } from '../../_utils/marks'
  import { createEventDispatcher, onMount } from "svelte";

  export let component;
  export let index;
  export let length;
  export let makeProps;
  export let key;

  const dispatch = createEventDispatcher();

  let props = undefined;

  onMount(async () => {
    if (makeProps) {
      props = await makeProps(key);
      mark('ListLazyItem set props');
      dispatch('initialized');
      stop('ListLazyItem set props');
    }
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