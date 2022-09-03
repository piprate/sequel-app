<script>
  import SearchResult from '../search/SearchResult.svelte'
  import IconButton from '../IconButton.svelte'
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { createEventDispatcher } from 'svelte'
  import { unwrap } from '../../_utils/mapper'
  import { massageUserText } from '../../_utils/massageUserText'
  import { autoplayGifs } from '../../_store/local'
  import Timestamp from '../Timestamp.svelte'

  export let release
  export let actions = undefined
  export let listMode = true

  let emojis = []

  const dispatch = createEventDispatcher()

  $: id = release.id
  $: summary = release.summary
  $: croppedSummary = summary ?
    (listMode && summary.length > 250) ? summary.substring(0, 250) + '...' : summary
    :
    ''
  $: massagedSummary = massageUserText(croppedSummary, emojis, $autoplayGifs)
  $: statusText = release.status
  $: href = listMode ? `/marketplace/releases/${unwrap(id)}` : ''

  function onButtonClick (event, action, releaseId) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', {
      action,
      releaseId
    })
  }
</script>

<SearchResult {href}>
    <div class="release-card">
        <div class="release-card-name">
            <EntityDisplayName entity={release} />
        </div>
        <div class="release-card-artist">
            by <EntityDisplayName entity={release.sellerRef} />
        </div>
        <div class="release-card-status">
            {statusText}
        </div>
        {#if release.startTime}
            <div class="release-card-start-time">
                <Timestamp value={release.startTime} resolution="full" flavour="starts" />
            </div>
        {/if}
        {#if release.endTime}
            <div class="release-card-end-time">
                <Timestamp value={release.endTime} resolution="full" flavour="ends" style="end" />
            </div>
        {/if}
        <div class="release-card-summary">
            {@html massagedSummary}
        </div>
        {#if actions && actions.length}
            <div class="release-card-buttons">
                {#each actions as action}
                    <IconButton
                            label={action.label}
                            on:click="{ (event) => onButtonClick(event, action, release.id) }"
                            href={action.icon}
                            big="true"
                    />
                {/each}
            </div>
        {/if}
    </div>
</SearchResult>
<style>
    .release-card {
        display: grid;
        grid-template-areas:
          "name"
          "artist"
          "summary"
          "status"
          "starttime"
          "endtime"
          "buttons";
        grid-column-gap: 20px;
        grid-template-columns: 1fr;
        align-items: center;
    }
    .release-card-name {
        grid-area: name;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.5em;
        margin-top: 5px;
    }
    .release-card-artist {
        grid-area: artist;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .release-card-status {
        grid-area: status;
        margin-top: 5px;
        font-size: 1.2em;
        color: var(--banner-fill);
        text-transform: uppercase;
    }
    .release-card-start-time {
        grid-area: starttime;
        margin-top: 5px;
        color: var(--very-deemphasized-text-color);
    }
    .release-card-end-time {
        grid-area: endtime;
        margin-top: 5px;
        color: var(--very-deemphasized-text-color);
    }
    .release-card-summary {
        margin-top: 5px;
        grid-area: summary;
        color: var(--deemphasized-text-color);
        word-wrap: break-word;
        overflow: hidden;
        white-space: pre-wrap;
    }
    .release-card-buttons {
        grid-area: buttons;
        display: flex;
    }
    :global(.release-card-buttons .icon-button) {
        margin-right: 20px;
    }
    :global(.release-card-buttons .icon-button:last-child) {
        margin-right: 0;
    }
    @media (max-width: 767px) {
        .release-card {
            grid-column-gap: 10px;
        }
        :global(.release-card-buttons .icon-button) {
            margin-right: 10px;
        }
    }
</style>
