<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import IconButton from '../IconButton.svelte'
  import InfoAside from '../InfoAside.svelte'
  import MediaField from '../MediaField.svelte'
  import { bubbleOperationError, bubbleOperationInProgress, saveBubble } from '../../_actions/bubbles'
  import { goto } from '@sapper/app'
  import { unwrap } from '../../_utils/mapper'
  import {
    BUBBLE_FEDERATION_MODE_OPTIONS,
    BUBBLE_MEMBERSHIP_MODE_OPTIONS,
    BUBBLE_OBSERVER_MODE_OPTIONS,
    BUBBLE_WRITER_MODE_OPTIONS
  } from '../../_static/bubbles'
  import { importShowOptionSelectionDialog } from '../dialog/asyncDialogs/importShowOptionSelectionDialog'
  import { importShowWorldSelectionDialog } from '../dialog/asyncDialogs/importShowWorldSelectionDialog'
  import { formatIntl } from '../../_utils/formatIntl'
  import { currentInductionLevel, setInductionLevel } from '../../_store/instance'
  import { sparkOperationError } from '../../_actions/sparks'

  export let realm
  export let newBubble
  export let bubbleId = ''
  export let template = undefined
  export let world = undefined

  // suppress warnings
  const intl = {}

  if (!template) {
    template = {
      name: '',
      handle: '',
      world: '',
      summary: '',
      summaryFormat: 'txt',
      membershipMode: 'invite_only',
      observerMode: 'public',
      writerMode: 'none',
      federationMode: 'disabled',
    }
  }

  function markSelectedOption (list, key) {
    return list.map(option => ({
      key: option.key,
      label: option.label,
      icon: option.icon,
      description: option.description,
      selected: key === option.key
    }))
  }

  $: formLabel = newBubble ? 'intl.newBubble' : 'intl.editBubble'
  $: buttonLabel = newBubble ? 'intl.createBubbleButton' : 'intl.editBubbleButton'
  $: buttonDisabled = !template.name || $bubbleOperationInProgress
  $: membershipModeOptions = markSelectedOption(BUBBLE_MEMBERSHIP_MODE_OPTIONS, template.membershipMode || 'invite_only')
  $: selectedMembershipMode = membershipModeOptions.find(_ => _.selected)
  $: membershipModeLabel = formatIntl('intl.membershipModeLabel', { label: selectedMembershipMode.label })
  $: observerModeOptions = markSelectedOption(BUBBLE_OBSERVER_MODE_OPTIONS, template.observerMode || 'members')
  $: selectedObserverMode = observerModeOptions.find(_ => _.selected)
  $: observerModeLabel = formatIntl('intl.observerModeLabel', { label: selectedObserverMode.label })
  $: writerModeOptions = markSelectedOption(BUBBLE_WRITER_MODE_OPTIONS, template.writerMode || 'none')
  $: selectedWriterMode = writerModeOptions.find(_ => _.selected)
  $: writerModeLabel = formatIntl('intl.writerModeLabel', { label: selectedWriterMode.label })
  $: federationModeOptions = markSelectedOption(BUBBLE_FEDERATION_MODE_OPTIONS, template.federationMode || 'disabled')
  $: selectedFederationMode = federationModeOptions.find(_ => _.selected)
  $: federationModeLabel = formatIntl('intl.federationModeLabel', { label: selectedFederationMode.label })
  $: worldName = world ? world.name : ''
  $: worldSelectorLabel = template.world ? 'intl.changeWorld' : 'intl.selectWorld'

  let summaryTextarea

  async function onMembershipModeClick () {
    const showDialog = await importShowOptionSelectionDialog()
    showDialog(membershipModeOptions, function (event) {
      template.membershipMode = event.detail
    }, '', 'intl.membershipModeTitle')
  }

  async function onObserverModeClick () {
    const showDialog = await importShowOptionSelectionDialog()
    showDialog(observerModeOptions, function (event) {
      template.observerMode = event.detail
    }, '', 'intl.observerModeTitle')
  }

  async function onWriterModeClick () {
    const showDialog = await importShowOptionSelectionDialog()
    showDialog(writerModeOptions, function (event) {
      template.writerMode = event.detail
    }, '', 'intl.writerModeTitle')
  }

  async function onFederationModeClick () {
    const showDialog = await importShowOptionSelectionDialog()
    showDialog(federationModeOptions, function (event) {
      template.federationMode = event.detail
      if (template.federationMode === 'disabled') {
        template.handle = ''
      }
    }, '', 'intl.federationModeTitle')
  }

  async function onWorldSelectorClick () {
    const showDialog = await importShowWorldSelectionDialog()
    showDialog(template.world, function (event) {
      world = event.detail
      template.world = (world && world.id) || ''
    }, '', 'intl.worldSelectionTitle')
  }

  async function onSubmitBubble (event) {
    event.preventDefault()
    event.stopPropagation()

    const bubble = await saveBubble(realm, bubbleId, template)

    if ($bubbleOperationError) {
      return
    }

    console.log('New/updated bubble', bubble)

    if (newBubble && $currentInductionLevel < 3) {
      setInductionLevel(3)
    }

    goto(`/bubbles/${unwrap(bubble.id)}?new`)
  }
</script>

<FreeTextLayout>
    <InfoAside className="notice-aside">
        {intl.newBubbleNotice}
    </InfoAside>
    <div class="bubble-form-box">
        <form on:submit='{onSubmitBubble}' aria-label="{formLabel}">

            {#if $bubbleOperationError}
                <div class="form-error form-error-user-error" role="alert">
                    {intl.errorShort} {@html $bubbleOperationError}
                </div>
            {/if}

            <label for="name">{intl.bubbleNameColon}</label>
            <input type="text" autocapitalize="none" id="name"
                   bind:value='{template.name}' placeholder="{intl.enterBubbleName}" required
            >

            <div class="bubble-toolbar">
                <div class="bubble-toolbar-items">
                    <IconButton
                            className="bubble-toolbar-button"
                            label={membershipModeLabel}
                            href={selectedMembershipMode.icon}
                            on:click="{onMembershipModeClick}"
                    />
                    <IconButton
                            className="bubble-toolbar-button"
                            label={observerModeLabel}
                            href={selectedObserverMode.icon}
                            on:click="{onObserverModeClick}"
                    />
                    <IconButton
                            className="bubble-toolbar-button"
                            label={writerModeLabel}
                            href={selectedWriterMode.icon}
                            on:click="{onWriterModeClick}"
                    />
                    <IconButton
                            className="bubble-toolbar-button"
                            label={federationModeLabel}
                            href={selectedFederationMode.icon}
                            on:click="{onFederationModeClick}"
                    />
                </div>
            </div>
            <InfoAside className="notice-aside">
                {selectedMembershipMode.description} {selectedObserverMode.description} {selectedWriterMode.description} {'intl.useButtonsAbove'}
            </InfoAside>
            {#if template.federationMode === 'enabled' }
                <label for="handle">{intl.bubbleHandleColon}</label>
                <input type="text" autocapitalize="none" spellcheck="false" id="handle"
                       bind:value='{template.handle}' placeholder="{intl.enterBubbleHandle}"
                >
            {/if}
            <label for="world">{intl.bubbleWorldColon}</label>
            <div class="world-selector">
                {#if worldName}
                    <div class="world-name">{worldName}</div>
                {/if}
                <button id="world" type="button" on:click={onWorldSelectorClick}>{worldSelectorLabel}</button>
            </div>
            <label for="summary">{intl.bubbleSummaryColon}</label>
            <textarea id="summary"
                      class="compose-summary-input"
                      placeholder="{intl.enterBubbleSummary}"
                      bind:this={summaryTextarea}
                      bind:value={template.summary}
            ></textarea>
            <label for="avatar">{intl.avatarColon}</label>
            <MediaField {realm} field="avatar" elementId="avatar" buttonLabel="{intl.addAvatarImage}" enableNFT="{true}" mediaProfile="avatar" />
            <InfoAside className="notice-aside">
                {'intl.avatarCroppingNotice'}
            </InfoAside>
            <label for="header">{intl.headerColon}</label>
            <MediaField {realm} field="header" elementId="header" buttonLabel="{intl.addHeaderImage}" enableNFT="{true}" />

            <button class="primary" type="submit" id="submitButton" disabled={buttonDisabled}>
                {buttonLabel}
            </button>
        </form>
    </div>
</FreeTextLayout>

<style>
    .bubble-form-box {
        background: var(--form-bg);
        padding: 5px 10px 15px;
        margin: 20px auto;
        border: 1px solid var(--form-border);
        border-radius: 4px;
    }

    .form-error {
        border: 2px solid var(--warn-color);
        border-radius: 2px;
        padding: 10px;
        font-size: 1.3em;
        margin: 5px;
        background-color: var(--main-bg);
    }
    input[type="text"] {
        min-width: 75%;
        max-width: 100%;
        background-color: var(--input-bg);
    }

    .compose-summary-input {
        min-width: 95%;
        font-size: 1.3em;
        background: var(--alt-input-bg);
        color: var(--body-text-color);
        min-height: 150px;
        max-height: 300px;
        border: 1px solid var(--input-border);
        resize: none;
    }

    .compose-summary-input:focus {
        background: var(--main-bg);
    }

    label, input, textarea, button, :global(.bubble-form-box-aside) {
        display: block;
        margin: 20px 5px;
    }

    .bubble-toolbar {
        grid-area: toolbar;
        align-self: center;
    }
    .bubble-toolbar-items {
        display: flex;
        align-items: center;
    }

    .world-selector {
        display: flex;
        align-items: center;
    }

    .world-selector #world {
        margin: 0 0;
    }

    .world-name {
        font-size: 1.2em;
        padding-left: 5px;
        padding-right: 10px;
    }

    :global(.notice-aside) {
        margin: 10px 10px 0 0;
    }

    @media (max-width: 320px) {
        :global(button.icon-button.bubble-toolbar-button) {
            padding-left: 5px;
            padding-right: 5px;
        }
    }
    @media (max-width: 240px) {
        :global(button.icon-button.bubble-toolbar-button .icon-button-svg) {
            width: 20px;
            height: 20px;
        }
    }

    @media (max-width: 767px) {
        input[type="text"] {
            min-width: 95%;
        }
    }

</style>
