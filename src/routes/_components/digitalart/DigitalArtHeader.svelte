<script>
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import Media from './Media.svelte'

  export let digitalArt

  const mediaList = [digitalArt.content]
  const uuid = 'token'
</script>

<h2 class="sr-only">{intl.nameAndProperties}</h2>
<div class="digital-art-media">
  <Media media={digitalArt.content} {uuid} mediaAttachments={mediaList} index={0} showAsSensitive={false} />
</div>
<div class="digital-art-name">
  <EntityDisplayName entity={digitalArt} />
</div>
<style>
  .digital-art-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .digital-art-media {
    grid-area: image;
    display: grid;
    align-items: center;
    justify-content: center;
    justify-items: center;
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    grid-template-columns: repeat(1, 1fr);

    overflow: hidden;
    margin: 10px 10px 10px 5px;
  }

  @media (max-width: 767px) {
    .digital-art-name {
      font-size: 1.3em;
      align-self: flex-start;
    }
  }
</style>