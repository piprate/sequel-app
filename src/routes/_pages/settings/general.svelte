<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import ThemeSettings from '../../_components/settings/instance/ThemeSettings.svelte'
  import {
    alwaysShowFocusRing,
    autoplayGifs,
    currentInstance,
    disableCustomScrollbars,
    disableInfiniteScroll,
    disableLongAriaLabels,
    disableTapOnPost,
    hideCards,
    ignoreBlurhash,
    isUserLoggedIn,
    loggedInInstancesInOrder,
    markMediaAsSensitive,
    largeInlineMedia,
    neverMarkMediaAsSensitive,
    omitEmojiInDisplayNames,
    reduceMotion,
    underlineLinks,
    centerNav
  } from "../../_store/local";
  import Tooltip from '../../_components/Tooltip.svelte'
  import UISettingsStyles from '../../_components/settings/UISettingsStyles.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { parseSettings, saveSettings } from '../../_actions/settings';
  import { switchToTheme } from '../../_utils/themeEngine';
  import { onMount } from 'svelte';

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  let allMediaSensitive = $markMediaAsSensitive
  let showSensitiveMedia = $neverMarkMediaAsSensitive

  let mediaForm
  let uiForm
  let a11yForm
  let themeForm

  let themeTouched = false

  $: themeTitle = (
      $loggedInInstancesInOrder.length > 1
              ? formatIntl('intl.themeForInstance', { instance: $currentInstance })
              : 'intl.theme'
  )

  onMount(() => {
    themeForm = document.querySelector('form#theme-settings')
    themeForm?.addEventListener('focusin', () => {
      themeTouched = true
    })
  })

  function onChange (event) {
    // these two are mutually exclusive
    if (['showSensitiveMedia', 'allMediaSensitive'].includes(event.target.name)) {
      if (event.target.id === 'choice-mark-media-sensitive') {
        showSensitiveMedia = false;
      } else {
        allMediaSensitive = false;
      }
    }

    saveSection(event)
  }

  function saveSection (event) {
    const form = event.currentTarget
    const section = form.name
    const formData = new FormData(form)
    
    if (['showSensitiveMedia', 'allMediaSensitive'].includes(event.target.name)) {
      if (event.target.id === 'choice-mark-media-sensitive') {
        formData.delete('showSensitiveMedia')
      } else {
        formData.delete('allMediaSensitive')
      }
    }
    
    const settings = Object.fromEntries(formData.entries())
    saveSettings(parseSettings(settings), 'general', section, true, true)
  }

  async function onSave () {
    const mediaFormData = new FormData(mediaForm)
    const uiFormData = new FormData(uiForm)
    const a11yFormData = new FormData(a11yForm)
    
    const media = Object.fromEntries(mediaFormData.entries())
    const ui = Object.fromEntries(uiFormData.entries())
    const a11y = Object.fromEntries(a11yFormData.entries())
    
    const settings = { media, ui, a11y }
    
    if (themeTouched) {
      const themeFormData = new FormData(themeForm)
      const theme = themeFormData.get('theme')
      
      settings.theme = theme

      await saveSettings({ theme }, 'instance', currentInstance.get(), false, true)
      switchToTheme(theme)
    }

    saveSettings(parseSettings(settings), 'general')
  }
</script>

<SettingsLayout page='settings/general' label="{intl.general}">
  <h1 slot="header">{intl.generalSettings}</h1>
  <button class="primary save-settings" on:click={onSave}>{intl.saveSettings}</button>
  <h2>{intl.media}</h2>
  <form bind:this={mediaForm} name="media" class="ui-settings" on:change={onChange}>
    <label class="setting-group">
      <input name='showSensitiveMedia' type="checkbox" id="choice-never-mark-media-sensitive"
             bind:checked="{showSensitiveMedia}">
      {intl.showSensitive}
    </label>
    <label class="setting-group">
      <input name='ignoreBlurhash' type="checkbox" id="choice-use-blurhash" checked="{$ignoreBlurhash}">
      {intl.showPlain}
    </label>
    <label class="setting-group">
      <input name='allMediaSensitive' type="checkbox" id="choice-mark-media-sensitive"
             bind:checked="{allMediaSensitive}">
      {intl.allSensitive}
    </label>
    <label class="setting-group">
      <input name="largeInlineMedia" type="checkbox" id="choice-large-inline-media" checked="{$largeInlineMedia}">
      {intl.largeMedia}
    </label>
    <label class="setting-group">
      <input name="autoplayGifs" type="checkbox" id="choice-autoplay-gif" checked="{$autoplayGifs}">
      {intl.autoplayGifs}
    </label>
  </form>

  <h2>UI</h2>
  <form bind:this={uiForm} name="ui" class="ui-settings" on:change={onChange}>
    <label class="setting-group">
      <input name="disableCustomScrollbars" type="checkbox" id="choice-disable-custom-scrollbars" checked="{$disableCustomScrollbars}">
      {intl.disableCustomScrollbars}
    </label>
    <label class="setting-group">
      <input name="disableInfiniteScroll" type="checkbox" id="choice-disable-infinite-scroll" checked="{$disableInfiniteScroll}">
      {intl.disableInfiniteScrollPre}
        <Tooltip
          text="{intl.disableInfiniteScrollText}"
          tooltipText="{intl.disableInfiniteScrollDescription}"
        />
      {intl.disableInfiniteScrollPost}
    </label>
    <label class="setting-group">
      <input name="hideCards" type="checkbox" id="choice-hide-cards" checked="{$hideCards}">
      {intl.hideCards}
    </label>
    <label class="setting-group">
      <input name="underlineLinks" type="checkbox" id="choice-underline-links" checked="{$underlineLinks}">
      {intl.underlineLinks}
    </label>
    <label class="setting-group">
      <input name="centerNav" type="checkbox" id="choice-center-nav" checked="{$centerNav}">
      {intl.centerNav}
    </label>
  </form>

  <h2>{intl.accessibility}</h2>
  <form bind:this={a11yForm} name="a11y" class="ui-settings" on:change={onChange}>
    <label class="setting-group">
      <input name="reduceMotion" type="checkbox" id="choice-reduce-motion" checked="{$reduceMotion}">
      {intl.reduceMotion}
    </label>
    <label class="setting-group">
      <input name="alwaysShowFocusRing" type="checkbox" id="choice-always-show-focus-ring" checked="{$alwaysShowFocusRing}">
      {intl.showRingPre}
      <Tooltip
        text="{intl.showRingText}"
        tooltipText="{intl.showRingDescription}"
      />
      {intl.showRingPost}
    </label>
    <label class="setting-group">
      <input name="disableTapOnPost" type="checkbox" id="choice-disable-tap-on-post" checked="{$disableTapOnPost}">
      {intl.disableTappable}
    </label>
    <label class="setting-group">
      <input name="omitEmojiInDisplayNames" type="checkbox" id="choice-omit-emoji-in-display-names" checked="{$omitEmojiInDisplayNames}">
      {intl.removeEmoji}
    </label>
    <label class="setting-group">
      <input name="disableLongAriaLabels" type="checkbox" id="choice-disable-long-aria-labels" checked="{$disableLongAriaLabels}">
      {intl.shortAria}
    </label>
  </form>

  {#if $isUserLoggedIn }
    <h2>{themeTitle}</h2>
    <ThemeSettings />
  {/if}
  <button slot="footer" class="primary save-settings" on:click={onSave}>{intl.saveSettings}</button>
</SettingsLayout>

<UISettingsStyles />
