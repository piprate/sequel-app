<script>
  import Shortcut from './shortcut/Shortcut.svelte'
  import SvgIcon from './SvgIcon.svelte'

  export let title
  export let icon = undefined
  export let ariaTitle = ''
  export let disableBackButton = false

  function onGoBack() {
    window.history.back()
  }
</script>

<div class="dynamic-page-banner {icon ? 'dynamic-page-with-icon' : ''}" role="navigation" aria-label={intl.pageHeader}>
  {#if icon}
    <SvgIcon className="dynamic-page-banner-svg" href={icon} />
  {/if}
  <h1 class="dynamic-page-title" aria-label={ariaTitle}>{title}</h1>
  {#if !disableBackButton}
    <button type="button" class="dynamic-page-go-back" aria-label={intl.goBack} on:click|preventDefault={onGoBack}
      >{intl.back}</button
    >
  {/if}
</div>
{#if !disableBackButton}
  <Shortcut key="Backspace" on:pressed={onGoBack} />
{/if}

<style>
  .dynamic-page-banner {
    display: grid;
    align-items: center;
    margin: 20px 20px 20px;
    grid-template-columns: 1fr min-content;
    grid-column-gap: 10px;
  }
  .dynamic-page-banner.dynamic-page-with-icon {
    grid-template-columns: min-content 1fr min-content;
  }
  :global(.dynamic-page-banner-svg) {
    width: 24px;
    height: 24px;
    fill: var(--body-text-color);
  }
  .dynamic-page-title {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dynamic-page-go-back {
    font-size: 1.3em;
    color: var(--anchor-text);
    border: 0;
    padding: 0;
    background: none;
    justify-self: flex-end;
  }
  .dynamic-page-go-back:hover {
    text-decoration: underline;
  }
  .dynamic-page-go-back::before {
    content: '←';
    margin-right: 5px;
  }
  @media (max-width: 767px) {
    .dynamic-page-banner {
      margin: 20px 10px 20px;
    }
    .dynamic-page-title {
      font-size: 1.3em;
    }
    .dynamic-page-go-back {
      font-size: 1.3em;
    }
  }
</style>
