<script>
  import { doubleRAF } from '../../_utils/doubleRAF'
  import { createEventDispatcher, onMount } from "svelte";
  import { unwrap } from "../../_utils/mapper";

  export let component;
  export let props;
  export let key;
  export let index;
  export let length;

  let shown = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    doubleRAF(() => {
      shown = true; // ensure fade-in animation happens after rAF
      dispatch('initialized');
    })
  });
</script>

<style>
  .list-item {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s linear;
    contain: content; /* see https://www.w3.org/TR/2018/CR-css-contain-1-20181108/#valdef-contain-content */
  }

  .list-item.shown {
    opacity: 1;
    pointer-events: auto;
  }
</style>
<div class="list-item {shown && 'shown'}"
     id={`list-item-${unwrap(key)}`} >
  <svelte:component this={component}
                    virtualProps={props}
                    virtualIndex={index}
                    virtualLength={length}
  />
</div>
