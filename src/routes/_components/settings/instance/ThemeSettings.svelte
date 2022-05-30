<script>
  import { onMount } from "svelte";
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import { changeTheme } from '../../../_actions/instances'
  import { themes } from '../../../_static/themes'
  import { DEFAULT_THEME } from '../../../_utils/themeEngine'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { instanceThemes } from "../../../_store/local";
  import { currentTheme } from "../../../_store/instance";

  export let instanceName;

  let selectedTheme = DEFAULT_THEME;

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

  function createThemeLabel (theme) {
    return formatIntl('intl.themeLabel', {
      label: theme.label,
      default: theme.name === DEFAULT_THEME
    })
  }

  function onThemeChange () {
    changeTheme(instanceName, selectedTheme)
  }

  onMount(() => {
    selectedTheme = $instanceThemes[instanceName] || DEFAULT_THEME
  });
</script>

<form class="generic-instance-settings" aria-label="{intl.chooseTheme}">
  <div class="theme-groups">
    {#each themeGroups as themeGroup}
    <div class="theme-group">
      <h3>
        {themeGroup.dark ? 'intl.darkBackground' : 'intl.lightBackground' }
      </h3>
      {#each themeGroup.themes as theme}
      <div class="theme-picker">
        <input type="radio" id="choice-theme-{theme.name}"
               value={theme.name} checked="{$currentTheme === theme.name}"
               bind:group="{selectedTheme}" on:change="{onThemeChange}">
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
