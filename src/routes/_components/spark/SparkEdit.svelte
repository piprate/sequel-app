<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import InfoAside from '../InfoAside.svelte'
  import MediaField from '../MediaField.svelte'
  import { saveSpark, setCurrentSpark, sparkOperationError, sparkOperationInProgress } from '../../_actions/sparks'
  import { goto } from '$app/navigation'
  import { unwrap } from '../../_utils/mapper'
  import { currentInstance } from '../../_store/local'
  import { importShowWorldSelectionDialog } from '../dialog/asyncDialogs/importShowWorldSelectionDialog'
  import { currentInductionLevel, setInductionLevel } from '../../_store/instance'
  import ErrorMessage from '../ErrorMessage.svelte'

  export let realm
  export let newSpark
  export let sparkId = ''
  export let template = undefined
  export let homeWorld = undefined

  // suppress warnings
  const intl = {}

  if (!template) {
    template = {
      name: '',
      handle: '',
      homeWorld: '',
      summary: '',
      summaryFormat: 'txt'
    }
  }

  $: buttonLabel = newSpark ? 'intl.createSparkButton' : 'intl.editSparkButton'
  $: buttonDisabled = !template.name || $sparkOperationInProgress
  $: homeWorldName = homeWorld ? homeWorld.name : ''
  $: homeWorldSelectorLabel = template.homeWorld ? 'intl.changeWorld' : 'intl.selectWorld'

  async function onHomeWorldSelectorClick () {
    const showDialog = await importShowWorldSelectionDialog()
    showDialog(template.homeWorld, function (event) {
      homeWorld = event.detail
      template.homeWorld = (homeWorld && homeWorld.id) || ''
    }, '', 'intl.homeWorldSelectionTitle')
  }

  let summaryTextarea

  async function onSubmitSpark (event) {
    event.preventDefault()
    event.stopPropagation()

    const spark = await saveSpark(realm, sparkId, template)

    if ($sparkOperationError) {
      return
    }

    console.log('New/updated spark', spark)

    // for new sparks, make current;
    // for updated sparks, reset to update navigation
    setCurrentSpark($currentInstance, spark)

    if (newSpark) {
      switch ($currentInductionLevel) {
        case 0:
          setInductionLevel(1)
          break
        case 1:
          setInductionLevel(2)
          break
      }
      goto(`/`)
    } else {
      goto(`/sparks/${unwrap(spark.id)}?new`)
    }
  }
</script>

<FreeTextLayout>
    <InfoAside className="notice-aside">
        {intl.newSparkNotice}
    </InfoAside>
    <div class="spark-form-box">
        <form on:submit='{onSubmitSpark}' aria-labelledby="new-spark-h1">

            <ErrorMessage error={$sparkOperationError} />

            <label for="name">{intl.sparkNameColon}</label>
            <input type="text" autocapitalize="none" id="name"
                   bind:value='{template.name}' placeholder="{intl.enterSparkName}" required
            >
            <label for="handle">{intl.sparkHandleColon}</label>
            <input type="text" autocapitalize="none" spellcheck="false" id="handle"
                   bind:value='{template.handle}' placeholder="{intl.enterSparkHandle}"
            >
            <label for="world">{intl.homeWorldColon}</label>
            <div class="world-selector">
                {#if homeWorldName}
                    <div class="world-name">{homeWorldName}</div>
                {/if}
                <button id="world" type="button" on:click={onHomeWorldSelectorClick}>{homeWorldSelectorLabel}</button>
            </div>
            <label for="summary">{intl.sparkSummaryColon}</label>
            <textarea id="summary"
                      class="compose-summary-input"
                      placeholder="{intl.enterSparkSummary}"
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
    .spark-form-box {
        background: var(--form-bg);
        padding: 5px 10px 15px;
        margin: 20px auto;
        border: 1px solid var(--form-border);
        border-radius: 4px;
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

    label, input, textarea, button, :global(.spark-form-box-aside) {
        display: block;
        margin: 20px 5px;
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

    @media (max-width: 767px) {
        input[type="text"] {
            min-width: 95%;
        }
    }

</style>
