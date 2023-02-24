<script>
  import IconButton from './IconButton.svelte'
  import MediaItem from './MediaItem.svelte'
  import { doMediaUpload, doTokenMediaUpload, updateMedia, uploadingMedia } from '../_actions/media'
  import { mediaAccept } from '../_static/media'
  import { currentComposeData } from '../_store/instance'
  import { importShowNFTSelectionDialog } from './dialog/asyncDialogs/importShowNFTSelectionDialog'
  import { currentInstance } from '../_store/local';

  export let realm
  export let field
  export let elementId = ''
  export let buttonLabel = 'intl.addMedia'
  export let nftButtonLabel = 'intl.addNFTMedia'
  export let addHash = false
  export let enableNFT = false
  export let mediaProfile = ''

  $: composeData = $currentComposeData[realm] || {}
  $: mediaItem = composeData[field]
  $: showElement = !!(mediaItem && mediaItem.data)
  $: hasOriginalToken = showElement && mediaItem.data && mediaItem.data.partOf
  $: originalSource = hasOriginalToken ? mediaItem.data.partOf.source : undefined
  $: originalToken = hasOriginalToken ? mediaItem.data.partOf.token : undefined
  $: uploadInProgress = $uploadingMedia === realm + field

  let input

  function onUploadButtonClick () {
    input.click()
  }

  async function onNFTSelectorClick () {
    const showDialog = await importShowNFTSelectionDialog()
    showDialog(originalSource, originalToken, async function (event) {
      const nft = event.detail
      console.log('NFT selected', nft)
      await doTokenMediaUpload(realm, field, nft, addHash, mediaProfile)
    }, '')
  }

  async function onFileChange (e) {
    const { files } = e.target
    for (const file of files) {
      await doMediaUpload(realm, field, file, addHash, mediaProfile)
    }
  }
</script>

<div class="selection-toolbar-buttons">
<IconButton
        {elementId}
        className="compose-toolbar-button"
        svgClassName={uploadInProgress ? 'spin' : ''}
        label={buttonLabel}
        href={uploadInProgress ? '#fa-spinner' : '#fa-camera'}
        on:click="{onUploadButtonClick}"
        disabled={$uploadingMedia}
/>
{#if enableNFT}
    <IconButton
            {elementId}
            className="compose-toolbar-button"
            svgClassName={uploadInProgress ? 'spin' : ''}
            label={nftButtonLabel}
            href={uploadInProgress ? '#fa-spinner' : '#nft-diamond'}
            on:click="{onNFTSelectorClick}"
            disabled={$uploadingMedia}
    />
{/if}
</div>
<!-- TODO: restrict mediaAccept -->
<input bind:this={input}
       on:change="{ e => { onFileChange(e) } }"
       style="display: none;"
       type="file"
       accept={mediaAccept} >
{#if showElement }
    <MediaItem {realm} {field} {mediaItem} />
{/if}

<style>
    .selection-toolbar-buttons {
        display: flex;
        align-items: center;
    }

    :global(button.icon-button.compose-toolbar-button) {
        display: block;
    }

    @media (max-width: 320px) {
        :global(button.icon-button.compose-toolbar-button) {
            padding-left: 5px;
            padding-right: 5px;
        }
    }

    @media (max-width: 240px) {
        :global(button.icon-button.compose-toolbar-button .icon-button-svg) {
            width: 20px;
            height: 20px;
        }
    }
</style>