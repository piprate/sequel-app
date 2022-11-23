<script>
  import IconButton from '../IconButton.svelte'
  import { currentInstance } from '../../_store/local'
  import { importShowEmojiDialog } from '../dialog/asyncDialogs/importShowEmojiDialog'
  import { importShowPostPrivacyDialog } from '../dialog/asyncDialogs/importShowPostPrivacyDialog'
  import { importShowPostInputFormatDialog } from '../dialog/asyncDialogs/importShowPostInputFormatDialog'
  import { doMediaUpload, doTokenMediaUpload, uploadingMedia } from '../../_actions/media'
  import { toggleContentWarningShown } from '../../_actions/contentWarnings'
  import { mediaAccept } from '../../_static/media'
  import { updateCustomEmojiForInstance } from '../../_actions/emoji'
  import { formatIntl } from '../../_utils/formatIntl'
  import { importShowNFTSelectionDialog } from '../dialog/asyncDialogs/importShowNFTSelectionDialog'

  export let realm
  export let postPrivacy
  export let media
  export let contentWarningShown
  export let enableNFT = false
  export let textFormat
  contentWarningShown = false

  let input

  $: postPrivacyLabel = formatIntl('intl.postPrivacyLabel', { label: postPrivacy.label })
  $: uploadInProgress = $uploadingMedia === realm
  $: hasOriginalToken = !!(media.data && media.data.partOf)

  async function onEmojiClick () {
    const [showEmojiDialog] = await Promise.all([
      importShowEmojiDialog(),
      updateCustomEmojiForInstance($currentInstance)
    ])
    showEmojiDialog(realm)
  }

  function onMediaClick () {
    input.click()
  }

  async function onNFTSelectorClick () {
    const showDialog = await importShowNFTSelectionDialog()
    // we pass empty current NFT values, as there may be multiple media items in the post
    showDialog('', '', async function (event) {
      const nft = event.detail
      console.log('NFT selected', nft)
      await doTokenMediaUpload(realm, '', nft, true, '')
    }, '')
  }

  async function onFileChange (e) {
    const { files } = e.target
    for (const file of files) {
      await doMediaUpload(realm, '', file, true, '')
    }
  }

  async function onPostPrivacyClick () {
    const showPostPrivacyDialog = await importShowPostPrivacyDialog()
    showPostPrivacyDialog(realm)
  }

  async function onPostInputFormatClick () {
    const showPostInputFormatDialog = await importShowPostInputFormatDialog()
    showPostInputFormatDialog(realm)
  }

  function onContentWarningClick () {
    toggleContentWarningShown(realm)
  }
</script>

<div class="compose-box-toolbar">
  <div class="compose-box-toolbar-items">
    <IconButton
            className="compose-toolbar-button"
            label="{intl.addEmoji}"
            href="#fa-smile"
            on:click="{onEmojiClick}"
    />
    <IconButton
            className="compose-toolbar-button"
            svgClassName={uploadInProgress ? 'spin' : ''}
            label="{intl.addMedia}"
            href={uploadInProgress ? '#fa-spinner' : '#fa-camera'}
            on:click="{onMediaClick}"
            disabled={$uploadingMedia || (media.length === 4)}
    />
    {#if enableNFT}
      <IconButton
              className="compose-toolbar-button"
              svgClassName={uploadInProgress ? 'spin' : ''}
              label="{intl.addNFTMedia}"
              href={uploadInProgress ? '#fa-spinner' : '#nft-diamond'}
              on:click="{onNFTSelectorClick}"
              disabled={$uploadingMedia}
      />
    {/if}
    <IconButton
            className="compose-toolbar-button"
            label={postPrivacyLabel}
            href={postPrivacy.icon}
            on:click="{onPostPrivacyClick}"
    />
<!--    <IconButton-->
<!--            className="compose-toolbar-button"-->
<!--            label="{intl.addContentWarning}"-->
<!--            pressedLabel="{intl.removeContentWarning}"-->
<!--            href="#fa-exclamation-triangle"-->
<!--            on:click="{onContentWarningClick}"-->
<!--            pressable={true}-->
<!--            pressed={contentWarningShown}-->
<!--    />-->
    <IconButton
            className="compose-toolbar-button"
            label="{intl.postInputFormat}"
            href={textFormat.icon}
            on:click="{onPostInputFormatClick}"
    />
  </div>
  
  <input bind:this={input}
         on:change="{onFileChange}"
         style="display: none;"
         type="file"
         multiple
         accept={mediaAccept} >
</div>

<style>
  .compose-box-toolbar {
    grid-area: toolbar;
    align-self: center;
  }
  .compose-box-toolbar-items {
    display: flex;
    align-items: center;
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