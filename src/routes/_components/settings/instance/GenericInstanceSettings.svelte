<script>
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import { onMount } from 'svelte'
  import { getStoreSettings, parseSettings, saveSettings } from '../../../_actions/settings'

  export let instanceName
  export let options
  export let label

  let form

  onMount(() => {
    for (const { key } of options) {
      form.elements[key].checked = getStoreSettings('instance', instanceName, 'notificationFilters', key)
    }
  })

  function applyChanges() {
    const settings = {}
    for (const { key } of options) {
      settings[key] = form.elements[key].checked
    }

    saveSettings(parseSettings({ notificationFilters: settings }), 'instance', instanceName, false, true)
  }
</script>

<div class="generic-instance-settings">
  <form
    id="notification-filter-settings"
    aria-label={label}
    bind:this={form}
    name="notificationFilters"
    on:change={applyChanges}
  >
    {#each options as option, i (option.key)}
      {#if i > 0}
        <br />
      {/if}
      <input type="checkbox" id="instance-option-{option.key}" name={option.key} />
      <label for="instance-option-{option.key}">
        {option.label}
      </label>
    {/each}
  </form>
</div>
<GenericInstanceSettingsStyle />
