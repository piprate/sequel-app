<script>
  import IconButton from '../IconButton.svelte'
  import { LOCALE } from '../../_static/intl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { thunk } from '../../_utils/thunk'
  import { importShowDigitalArtTokenOptionsDialog } from '../dialog/asyncDialogs/importShowDigitalArtTokenOptionsDialog'

  const numberFormat = thunk(() => new Intl.NumberFormat(LOCALE))

  export let token
  export let ourSpark

  $: id = token.id || 0
  $: editionsDisplay = formatIntl('intl.tokenEditions', {
    edition: numberFormat().format(token.edition),
    total: numberFormat().format(token.object.maxEdition)
  })
  $: sparkSelected = !!ourSpark

  async function onMoreOptionsClick () {
    const showOptionsDialog = await importShowDigitalArtTokenOptionsDialog()
    showOptionsDialog(token, null, ourSpark)
  }
</script>

<h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
<div class="digital-art-details">
  <div class="digital-art-details-item">
    <span class="digital-art-details-item-title">
      {intl.tokenID}
    </span>
    <span class="digital-art-details-item-datum">
      #{id}
    </span>
  </div>
  <div class="digital-art-details-item">
    <span class="digital-art-details-item-title">
      {intl.tokenEdition}
    </span>
    <span class="digital-art-details-item-datum">
      {editionsDisplay}
    </span>
  </div>
  <div class="digital-art-details-item">
    <span class="digital-art-details-item-title">
      {intl.tokenType}
    </span>
    <span class="digital-art-details-item-datum">
      Digital Art
    </span>
  </div>
  <div class="digital-art-more-options">
    <IconButton
      label="{intl.moreOptions}"
      href="#fa-bars"
      muted="true"
      on:click="{onMoreOptionsClick}"
    />
  </div>
</div>
<style>
  .digital-art-details {
    grid-area: details;
    display: grid;
    margin: 0 5px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr min-content;
  }

  .digital-art-details-item {
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    font-size: 1.1em;
  }

  .digital-art-details-item:hover {
    text-decoration: none;
    background: var(--button-bg-hover);
    cursor: pointer;
  }

  .digital-art-details-item:active {
    background: var(--button-bg-active);
  }

  .digital-art-details-item-title {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .digital-art-details-item-datum {
    color: var(--body-text-color);
    margin-left: 5px;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .digital-art-details-item {
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }

    .digital-art-details-item:last-child {
      margin-right: 0;
    }

    .digital-art-details-item:first-child {
      margin-left: 0;
    }

    .digital-art-details-item-title {
      margin-right: 0;
      text-align: center;
    }
    .digital-art-details-item-datum {
      margin-left: 0;
      text-align: center;
    }
    .digital-art-details-item {
      font-size: 1em;
    }
  }

  @media (max-width: 240px) {
    .digital-art-details {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .digital-art-more-options {
      justify-self: flex-end;
      grid-column: 1 / 4;
    }
  }
</style>
