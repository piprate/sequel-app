<script>
  import MediaItem from '../MediaItem.svelte'
  import SvgIcon from '../SvgIcon.svelte'

  export let realm
  export let media

  let duplicates = []
  $: duplicates = !media.length ? [] : duplicates
  $: isDuplicated = !!duplicates.length

  $: {
    for (const [index, { data }] of media.entries()) {
      // reset duplicates in case an item leaves
      duplicates = []

      const duplicate = media.find(({ data: _ }, i) => {
        return _.id === data.id && index !== i
      })

      if (duplicate) duplicates = duplicates.concat(duplicate)
    }
  }
</script>

{#if isDuplicated}
  <p class="warning">
    <SvgIcon href="#fa-warning" className="warning-icon" />
    <span>{intl.composeMediaWarning}</span>
  </p>
{/if}
{#if media.length}
  <ul
    class="compose-media-container"
    aria-label={intl.mediaUploads}
    style="grid-template-columns: repeat({media.length}, 1fr);"
  >
    {#each media as mediaItem, index}
      <MediaItem {realm} {mediaItem} {index} {media} />
    {/each}
  </ul>
{/if}

<style>
  .compose-media-container {
    grid-area: media;
    list-style: none;
    display: grid;
    grid-column-gap: 5px;
    align-items: center;
    justify-content: center;
    margin: 10px 0 0 0;
    background: var(--form-bg);
    padding: 5px;
    border-radius: 4px;
  }

  .warning {
    margin-top: 1rem;
    color: var(--warning-color);
    font-size: small;
    grid-area: warning;
    display: flex;
    align-items: center;
  }

  .warning span {
    margin-left: 0.5rem;
  }

  :global(.warning .warning-icon) {
    fill: var(--warning-color);
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
