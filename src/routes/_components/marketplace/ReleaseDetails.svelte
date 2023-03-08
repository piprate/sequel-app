<script>
    import { onMount } from "svelte";
    import { importShowReleaseOptionsDialog } from "../dialog/asyncDialogs/importShowReleaseOptionsDialog";
    import IconButton from "../IconButton.svelte";

    export let release
    export let listingsFetcher
    
    let listings = []

    onMount(async() => {
        listings = await listingsFetcher()
    })

    
  async function onMoreOptionsClick () {
    const showOptionsDialog = await importShowReleaseOptionsDialog()
    showOptionsDialog(release, listings)
  }
  </script>
  
  <h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
  <div class="release-details">
    <div class="release-details-item">
      <span class="release-details-item-title">
        {intl.releaseListings}
      </span>
      <span class="release-details-item-datum">
        {listings.length}
      </span>
    </div>
    <div class="release-details-item">
      <span class="release-details-item-title">
        {intl.sold}
      </span>
      <span class="release-details-item-datum">
        N/A
      </span>
    </div>
    <div class="release-details-item">
      <span class="release-details-item-title">
        {intl.total}
      </span>
      <span class="release-details-item-datum">
        N/A
      </span>
    </div>
  <div class="release-more-options">
    <IconButton
      label="{intl.moreOptions}"
      href="#fa-bars"
      muted
      on:click="{onMoreOptionsClick}"
    />
  </div>
</div>
  <style>
    .release-details {
      grid-area: details;
      display: grid;
      margin: 0 5px;
      align-items: center;
      grid-template-columns: 1fr 1fr 1fr min-content;
    }
  
    .release-details-item {
      display: flex;
      flex-direction: row;
      padding: 5px;
      justify-content: center;
      font-size: 1.1em;
    }
  
    .release-details-item:hover {
      text-decoration: none;
      background: var(--button-bg-hover);
      cursor: pointer;
    }
  
    .release-details-item:active {
      background: var(--button-bg-active);
    }
  
    .release-details-item-title {
      text-transform: uppercase;
      color: var(--deemphasized-text-color);
      margin-right: 5px;
    }
  
    .release-details-item-datum {
      color: var(--body-text-color);
      margin-left: 5px;
      font-weight: 600;
      white-space: nowrap;
    }
  
    @media (max-width: 767px) {
      .release-details-item {
        flex-direction: column;
        margin-left: 5px;
        margin-right: 5px;
      }
  
      .release-details-item:last-child {
        margin-right: 0;
      }
  
      .release-details-item:first-child {
        margin-left: 0;
      }
  
      .release-details-item-title {
        margin-right: 0;
        text-align: center;
      }
      .release-details-item-datum {
        margin-left: 0;
        text-align: center;
      }
      .release-details-item {
        font-size: 1em;
      }
    }
  
    @media (max-width: 240px) {
      .release-details {
        grid-template-columns: 1fr 1fr 1fr;
      }
      .release-more-options {
        justify-self: flex-end;
        grid-column: 1 / 4;
      }
    }
  </style>
  