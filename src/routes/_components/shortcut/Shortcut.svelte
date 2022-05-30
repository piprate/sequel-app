<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { addToShortcutScope, removeFromShortcutScope } from '../../_utils/shortcuts'

  export let scope = 'global';
  export let key = null;

  const dispatch = createEventDispatcher();

  let __this = {
    onKeyDown: function (event) {
      console.log("key pressed");
      event.stopPropagation()
      event.preventDefault()
      dispatch('pressed', {
        key: event.key,
        timeStamp: event.timeStamp
      });
    }
  };

  onMount(() => {
    addToShortcutScope(scope, key, __this);
    return () => {
      removeFromShortcutScope(scope, key, __this);
    }
  });
</script>
