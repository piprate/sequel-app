<script>
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte';
  import InfoAside from '../../_components/InfoAside.svelte';
  import { saveWorld, worldOperationError, worldOperationInProgress } from "../../_actions/worlds";
  import { goto } from '@sapper/app';
  import { unwrap } from "../../_utils/mapper";
  import MediaField from "../../_components/MediaField.svelte";

  export let realm;
  export let newWorld;
  export let worldId = '';
  export let template = undefined;

  // suppress warnings
  const intl = {};

  if (!template) {
    template = {
      name: '',
      summary: '',
      summaryFormat: 'txt'
    };
  }

  $: buttonLabel = newWorld ? 'intl.createWorldButton' : 'intl.editWorldButton';
  $: buttonDisabled = !template.name || $worldOperationInProgress;

  let summaryTextarea;

  async function onSubmitWorld (event) {
    event.preventDefault();
    event.stopPropagation();

    const world = await saveWorld(realm, worldId, template);
    console.log("New/updated world", world);

    goto(`/worlds/${unwrap(world.id)}?new`);
  }
</script>

<FreeTextLayout>
    <InfoAside className="notice-aside">
        {intl.newWorldNotice}
    </InfoAside>
    <div class="world-form-box">
        <form on:submit='{onSubmitWorld}' aria-labelledby="new-world-h1">

            {#if $worldOperationError}
                <div class="form-error form-error-user-error" role="alert">
                    {intl.errorShort} {@html $worldOperationError}
                </div>
            {/if}

            <label for="name">{intl.worldNameColon}</label>
            <input type="text" autocapitalize="none" id="name"
                   bind:value='{template.name}' placeholder="{intl.enterWorldName}" required
            >
            <label for="summary">{intl.worldSummaryColon}</label>
            <textarea id="summary"
                      class="compose-summary-input"
                      placeholder="{intl.enterWorldSummary}"
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
    .world-form-box {
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

    label, input, textarea, button, :global(.world-form-box-aside) {
        display: block;
        margin: 20px 5px;
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
