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

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  $: themeTitle = (
      $loggedInInstancesInOrder.length > 1
              ? formatIntl('intl.themeForInstance', { instance: $currentInstance })
              : 'intl.theme'
  )

  function onChange (event) {
    // these two are mutually exclusive
    if ($markMediaAsSensitive && $neverMarkMediaAsSensitive) {
      if (event.target.id === 'choice-mark-media-sensitive') {
        $neverMarkMediaAsSensitive = false;
      } else {
        $markMediaAsSensitive = false;
      }
    }
  }
</script>

<SettingsLayout page='settings/general' label="{intl.general}">
  <h1>{intl.generalSettings}</h1>

  <h2>{intl.media}</h2>
  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-never-mark-media-sensitive"
             bind:checked="{$neverMarkMediaAsSensitive}" on:change="{onChange}">
      {intl.showSensitive}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-use-blurhash"
              bind:checked="{$ignoreBlurhash}">
      {intl.showPlain}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-mark-media-sensitive"
             bind:checked="{$markMediaAsSensitive}" on:change="{onChange}">
      {intl.allSensitive}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-large-inline-media"
             bind:checked="{$largeInlineMedia}">
      {intl.largeMedia}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-autoplay-gif"
             bind:checked="{$autoplayGifs}">
      {intl.autoplayGifs}
    </label>
  </form>

  <h2>UI</h2>
  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-custom-scrollbars"
             bind:checked="{$disableCustomScrollbars}">
      {intl.disableCustomScrollbars}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-infinite-scroll"
             bind:checked="{$disableInfiniteScroll}">
      {intl.disableInfiniteScrollPre}
        <Tooltip
          text="{intl.disableInfiniteScrollText}"
          tooltipText="{intl.disableInfiniteScrollDescription}"
        />
      {intl.disableInfiniteScrollPost}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-hide-cards"
             bind:checked="{$hideCards}">
      {intl.hideCards}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-underline-links"
             bind:checked="{$underlineLinks}">
      {intl.underlineLinks}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-center-nav"
             bind:checked="{$centerNav}">
      {intl.centerNav}
    </label>
  </form>

  <h2>{intl.accessibility}</h2>
  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-reduce-motion"
             bind:checked="{$reduceMotion}">
      {intl.reduceMotion}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-always-show-focus-ring"
             bind:checked="{$alwaysShowFocusRing}">
      {intl.showRingPre}
      <Tooltip
        text="{intl.showRingText}"
        tooltipText="{intl.showRingDescription}"
      />
      {intl.showRingPost}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-tap-on-post"
             bind:checked="{$disableTapOnPost}">
      {intl.disableTappable}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-omit-emoji-in-display-names"
             bind:checked="{$omitEmojiInDisplayNames}">
      {intl.removeEmoji}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-long-aria-labels"
             bind:checked="{$disableLongAriaLabels}">
      {intl.shortAria}
    </label>
  </form>

  {#if $isUserLoggedIn }
    <h2>{themeTitle}</h2>
    <ThemeSettings instanceName={$currentInstance} />
  {/if}
</SettingsLayout>
<UISettingsStyles />
