<script>
  import Media from './Media.svelte'
  import { classname } from '../../_utils/classname'
  import { largeInlineMedia } from '../../_store/local'

  export let mediaAttachments
  export let sensitive
  export let sensitiveShown
  export let uuid

  $: computedClass = classname(
    'post-media',
    sensitive && 'post-media-is-sensitive',
    oddCols && 'odd-cols',
    twoCols && 'two-cols',
    $largeInlineMedia ? 'not-grouped-images' : 'grouped-images'
  )
  $: showAsSensitive = sensitive ? !sensitiveShown : false
  $: nCols = !$largeInlineMedia && mediaAttachments.length > 1 ? 2 : 1
  $: oddCols = mediaAttachments.length > 1 && mediaAttachments.length % 2
  $: twoCols = mediaAttachments.length === 2
</script>

<div class={computedClass} style="grid-template-columns: repeat({nCols}, 1fr);">
  {#each mediaAttachments as media, index}
    <Media {media} {uuid} {mediaAttachments} {index} {showAsSensitive} showNFT="true" />
  {/each}
</div>

<style>
  .post-media {
    grid-area: media;
    display: grid;
    align-items: center;
    justify-content: center;
    justify-items: center;
    grid-column-gap: 5px;
    grid-row-gap: 5px;

    overflow: hidden;
    margin: 10px 10px 10px 5px;
  }

  .post-media.grouped-images {
    grid-area: media-grp;
    border-radius: 6px;
  }

  .post-media.grouped-images > :global(.inline-media) {
    padding-bottom: 56.25%;
    width: 100%;
  }

  .post-media.grouped-images.two-cols > :global(.inline-media) {
    padding-bottom: calc(112.5% + 5px);
  }

  .post-media.grouped-images.odd-cols > :global(.inline-media:first-child) {
    grid-row-end: span 2;
    padding-bottom: calc(112.5% + 5px);
    background-color: blue;
  }

  .post-media.not-grouped-images > :global(.inline-media) {
    width: 100%;
    min-height: 250px;
  }

  .post-media.not-grouped-images :global(.inline-media img),
  .post-media.not-grouped-images :global(.inline-media .lazy-image) {
    width: 100%;
    height: 100%;
  }

  .post-media.post-media-is-sensitive {
    height: inherit;
    margin: 0;
  }
</style>
