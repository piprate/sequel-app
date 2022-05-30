<script>
  import IconButton from '../IconButton.svelte'
  import { currentInstance } from '../../_store/local'
  import { importShowEmojiDialog } from '../dialog/asyncDialogs/importShowEmojiDialog'
  import { importShowPostPrivacyDialog } from '../dialog/asyncDialogs/importShowPostPrivacyDialog'
  import { doMediaUpload, uploadingMedia } from '../../_actions/media'
  import { toggleContentWarningShown } from '../../_actions/contentWarnings'
  import { mediaAccept } from '../../_static/media'
  import { enablePoll, disablePoll } from '../../_actions/composePoll'
  import { updateCustomEmojiForInstance } from '../../_actions/emoji'
  import { formatIntl } from '../../_utils/formatIntl'

  export let realm;
  export let postPrivacy;
  export let media;
  export let contentWarningShown;
  export let poll;

  let input;

  $: postPrivacyLabel = formatIntl('intl.postPrivacyLabel', { label: postPrivacy.label });

  async function onEmojiClick() {
    const [showEmojiDialog] = await Promise.all([
      importShowEmojiDialog(),
      updateCustomEmojiForInstance($currentInstance)
    ])
    showEmojiDialog(realm)
  }

  function onMediaClick() {
    input.click()
  }

  async function onFileChange(e) {
    const { files } = e.target
    for (const file of files) {
      await doMediaUpload(realm, file)
    }
  }

  async function onPostPrivacyClick() {
    const showPostPrivacyDialog = await importShowPostPrivacyDialog()
    showPostPrivacyDialog(realm)
  }

  function onContentWarningClick() {
    toggleContentWarningShown(realm)
  }

  function onPollClick() {
    if (poll && poll.options && poll.options.length) {
      disablePoll(realm)
    } else {
      enablePoll(realm)
    }
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
            svgClassName={$uploadingMedia ? 'spin' : ''}
    label="{intl.addMedia}"
    href={$uploadingMedia ? '#fa-spinner' : '#fa-camera'}
    on:click="{onMediaClick}"
    disabled={$uploadingMedia || (media.length === 4)}
    />
    <IconButton
            className="compose-toolbar-button"
            label="{intl.addPoll}"
            pressedLabel="{intl.removePoll}"
            href="#fa-bar-chart"
            on:click="{onPollClick}"
            pressable={true}
            pressed={poll && poll.options && poll.options.length}
    />
    <IconButton
            className="compose-toolbar-button"
            label={postPrivacyLabel}
            href={postPrivacy.icon}
            on:click="{onPostPrivacyClick}"
    />
    <IconButton
            className="compose-toolbar-button"
            label="{intl.addContentWarning}"
            pressedLabel="{intl.removeContentWarning}"
            href="#fa-exclamation-triangle"
            on:click="{onContentWarningClick}"
            pressable={true}
            pressed={contentWarningShown}
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