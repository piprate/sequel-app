<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import MediaField from '../MediaField.svelte'
  import {
    clearDigitalArt,
    digitalArtOperationError,
    digitalArtOperationInProgress,
    loadDigitalArt,
    saveDigitalArt,
    updateDigitalArt
  } from '../../_actions/digitalArt'
  import { goto } from '$app/navigation'
  import ErrorMessage from '../ErrorMessage.svelte'
  import { composeData, currentInstance, setComposeData } from '../../_store/local'
  import { get } from '../../_utils/lodash-lite'
  import { onMount } from 'svelte'
  import { setComposeImage } from '../../_actions/media'

  export let realm
  export let digitalArtId = ''
  let payload = {}
  let digitalArt

  $: newDigitalArt = !digitalArtId

  // suppress warnings
  const intl = {}

  onMount(async () => {
    if (digitalArtId) {
      digitalArt = await loadDigitalArt(digitalArtId)

      payload = {
        name: digitalArt?.name || '',
        type: 'DigitalArt',
        description: digitalArt?.description || '',
        maxEdition: digitalArt?.maxEdition || 1,
        content: digitalArt?.content || null
      }

      if (digitalArt.content) {
        setComposeImage(realm, digitalArt, 'content')
      }
    }
  })

  $: formLabel = newDigitalArt ? 'intl.newDigitalArt' : 'intl.editDigitalArt'
  $: buttonLabel = newDigitalArt ? 'intl.createButton' : 'intl.editButton'
  $: buttonDisabled = !payload?.name || $digitalArtOperationInProgress

  $: {
    if (digitalArtId) {
      try {
        clearDigitalArt().then(() => updateDigitalArt(digitalArtId))
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function onSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    await saveDigitalArt(realm, digitalArtId, payload)

    if ($digitalArtOperationError) {
      return
    }

    goto(newDigitalArt ? '/studio' : `/studio/digital-art/${digitalArtId}`)
  }
</script>

<FreeTextLayout>
  <div class="digitalArt-form-box">
    <form on:submit={onSubmit} aria-label={formLabel}>
      <ErrorMessage error={$digitalArtOperationError} />

      <label for="name">{intl.DigitalArtNameColon}</label>
      <input
        type="text"
        autocapitalize="none"
        id="name"
        bind:value={payload.name}
        placeholder={intl.enterDigitalArtName}
        required
      />

      <label for="description">{intl.DigitalArtDescriptionColon}</label>
      <textarea
        id="description"
        class="compose-description-input"
        placeholder={intl.enterDigitalArtDescription}
        bind:value={payload.description}
      />
      <label for="maxEditions">{intl.DigitalArtMaxEditionsColon}</label>
      <input
        type="number"
        autocapitalize="none"
        id="maxEditions"
        bind:value={payload.maxEdition}
        placeholder={intl.enterDigitalArtMaxEditions}
        required
      />
      <label for="image">{intl.DigitalArtImageColon}</label>
      <MediaField
        {realm}
        field="content"
        elementId="image"
        buttonLabel={intl.addDigitalArtImage}
        mediaProfile="public_asset"
      />

      <button class="primary" type="submit" id="submitButton" disabled={buttonDisabled}>
        {buttonLabel}
      </button>
    </form>
  </div>
</FreeTextLayout>

<style>
  .digitalArt-form-box {
    background: var(--form-bg);
    padding: 5px 10px 15px;
    margin: 20px auto;
    border: 1px solid var(--form-border);
    border-radius: 4px;
  }

  input[type='text'] {
    min-width: 75%;
    max-width: 100%;
    background-color: var(--input-bg);
  }

  .compose-description-input {
    min-width: 95%;
    font-size: 1.3em;
    background: var(--alt-input-bg);
    color: var(--body-text-color);
    min-height: 150px;
    max-height: 300px;
    border: 1px solid var(--input-border);
    resize: none;
  }

  .compose-description-input:focus {
    background: var(--main-bg);
  }

  label,
  input,
  textarea,
  button,
  :global(.digitalArt-form-box-aside) {
    display: block;
    margin: 20px 5px;
  }

  :global(.notice-aside) {
    margin: 10px 10px 0 0;
  }

  @media (max-width: 320px) {
    :global(button.icon-button.digitalArt-toolbar-button) {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  @media (max-width: 240px) {
    :global(button.icon-button.digitalArt-toolbar-button .icon-button-svg) {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 767px) {
    input[type='text'] {
      min-width: 95%;
    }
  }
</style>
