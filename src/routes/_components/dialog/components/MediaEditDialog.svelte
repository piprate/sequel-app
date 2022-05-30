<script>
  import ModalDialog from './ModalDialog.svelte'
  import MediaFocalPointEditor from '../components/MediaFocalPointEditor.svelte'
  import MediaAltEditor from '../components/MediaAltEditor.svelte'
  import { composeData, currentInstance } from '../../../_store/local'
  import { get } from '../../../_utils/lodash-lite'

  export let id;
  export let label;
  export let title;
  export let realm;
  export let index;
  export let type;

  $: media = get($composeData, [$currentInstance, realm, 'media']);

  let altEditor;
  let focalPointEditor;

  function measure () {
    altEditor.measure();
    if (focalPointEditor) {
      focalPointEditor.measure();
    }
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        background="var(--main-bg)"
        className="media-edit-dialog"
        on:show="{measure}"
>
  <div class="media-edit-dialog-container">
    <div class="media-edit-header-and-item media-edit-header-and-item-alt">
      <h2>Description</h2>
      <MediaAltEditor
              className="media-edit-item"
              {realm}
              {index}
              {media}
              on:resize="{measure}"
              bind:this={altEditor}
      />
    </div>
    {#if type === 'image' || type === 'gifv'}
      <div class="media-edit-header-and-item media-edit-header-and-item-focal">
        <h2>{intl.previewFocalPoint}</h2>
        <MediaFocalPointEditor
                className="media-edit-item"
                {realm}
                {index}
                {media}
                bind:this={focalPointEditor}
        />
      </div>
    {/if}
  </div>
</ModalDialog>
<style>
  :global(.media-edit-dialog) {
    max-width: calc(100%);
  }

  .media-edit-dialog-container {
    display: flex;
    flex-direction: row;
    max-height: calc(100% - 44px); /* 44px X button height */
    height: 100%;
    width: 100%;
  }

  .media-edit-header-and-item {
    padding: 10px;
  }

  .media-edit-header-and-item h2 {
    margin-bottom: 10px;
  }

  @media (max-width: 767px) {
    .media-edit-dialog-container {
      flex-direction: column;
      overflow: hidden;
    }

    .media-edit-dialog-container {
      max-height: calc(100% - 25px); /* 25px X button height */
    }

    .media-edit-header-and-item {
      flex: 1;
      min-height: 0;
      padding: 5px 10px;
    }
    .media-edit-header-and-item {
      display: flex;
      flex-direction: column;
    }

    :global(.media-edit-item) {
      flex: 1;
      min-height: 0;
    }
    .media-edit-header-and-item-alt {
      flex-basis: 40%;
    }
    .media-edit-header-and-item-focal {
      flex-basis: 60%;
    }

    .media-edit-header-and-item h2 {
      font-size: 1.2em;
      margin-bottom: 5px;
    }
  }

</style>