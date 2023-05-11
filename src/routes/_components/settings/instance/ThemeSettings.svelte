<script>
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import { themes } from '../../../_static/themes'
  import { DEFAULT_THEME, switchToTheme } from '../../../_utils/themeEngine'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { currentInstance, selectedTheme, userSettings } from "../../../_store/local";
  import { get } from '../../../_utils/lodash-lite';
  import { onMount } from 'svelte';
  import { parseSettings, saveSettings } from '../../../_actions/settings';

  let currentTheme
  let isGeneral = false

  let themeGroups = [
    {
      dark: true,
      themes: themes.filter(_ => _.dark)
    },
    {
      dark: false,
      themes: themes.filter(_ => !_.dark)
    }
  ]
  
  $: generalTheme = get($userSettings, ['general', 'theme'])

  onMount(() => {
    isGeneral = location.pathname.includes('general')

    currentTheme = isGeneral ? generalTheme : $selectedTheme
  })

  function createThemeLabel (theme) {
    return formatIntl('intl.themeLabel', {
      label: theme.label,
      default: theme.name === DEFAULT_THEME
    })
  }

  function previewTheme (event) {
    const selectedTheme = event.target.value
    switchToTheme(selectedTheme)
    saveSettings(parseSettings({ theme: selectedTheme }), 'instance', $currentInstance, false, true)
    
    if (isGeneral) {
      saveSettings(parseSettings({ theme: selectedTheme }), 'general', undefined, false, true)
    }
  }
</script>

<form id="theme-settings" class="generic-instance-settings" aria-label="{intl.chooseTheme}">
  <div class="theme-groups">
    {#each themeGroups as themeGroup}
    <div class="theme-group">
      <h3>
        {themeGroup.dark ? 'intl.darkBackground' : 'intl.lightBackground' }
      </h3>
      {#each themeGroup.themes as theme}
      <div class="theme-picker">
        <input name='theme' type="radio" id="choice-theme-{theme.name}" value={theme.name} checked={currentTheme === theme.name} on:change={previewTheme}>
        <label class="theme-picker-label" for="choice-theme-{theme.name}">
          <div class="theme-preview theme-preview-{themeGroup.dark ? 'dark' : 'light'}"
               style="background-color: {theme.color};" >
          </div>
          <span class="theme-picker-label-span">
            {createThemeLabel(theme)}
          </span>
        </label>
      </div>
      {/each}
    </div>
    {/each}
  </div>
</form>
<GenericInstanceSettingsStyle/>
<style>
  .theme-groups {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .theme-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
  }
  .theme-picker {
    display: flex;
    align-items: center;
  }
  .theme-picker-label {
    display: flex;
    align-items: center;
  }
  .theme-picker-label-span {
    margin: 2px 10px 0;
  }
  .theme-preview {
    width: 21px;
    height: 21px;
    box-sizing: border-box;
    border-radius: 2px;
    margin: 0 2px 0 10px;
  }
  .theme-preview-dark {
    border: 2px solid #000;
  }
  .theme-preview-light {
    border: 2px solid #dadada;
  }

  h3 {
    font-size: 1.4em;
  }

  @media (max-width: 479px) {
    .theme-groups {
      grid-template-columns: 1fr;
    }

    h3 {
      margin-top: 0.5em;
    }
  }

  @media (max-width: 240px) {
    .theme-groups {
      grid-row-gap: 25px; /* TODO: "Dark background" text overlaps with previous div on KaiOS for some reason */
    }
  }
</style>
