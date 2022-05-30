<script>
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import { getInstanceSetting, setInstanceSetting } from '../../../_store/local'
  import {onMount} from "svelte";

  export let instanceName;
  export let options;
  export let label;

  let form;

  function onChange(event) {
    const { target } = event
    setInstanceSetting(instanceName, target.name, target.checked)
  }

  onMount(() => {
    for (const { key, defaultValue } of options) {
      form.elements[key].checked = getInstanceSetting(instanceName, key, defaultValue)
    }
  });
</script>

<div class="generic-instance-settings">
  <form aria-label={label} bind:this={form}>
    {#each options as option, i (option.key) }
      {#if i > 0}
        <br>
      {/if}
      <input type="checkbox"
             id="instance-option-{option.key}"
             name="{option.key}"
             on:change="{onChange}"
      >
      <label for="instance-option-{option.key}">
        {option.label}
      </label>
    {/each}
  </form>
</div>
<GenericInstanceSettingsStyle/>
