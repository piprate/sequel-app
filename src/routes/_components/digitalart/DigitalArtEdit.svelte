<script>
    import FreeTextLayout from '../FreeTextLayout.svelte'
    import MediaField from '../MediaField.svelte'
    import { digitalArtOperationError, digitalArtOperationInProgress, saveDigitalArt } from '../../_actions/digitalArt'
    import { goto } from '$app/navigation'
    import ErrorMessage from '../ErrorMessage.svelte'
    import { composeData, currentInstance, setComposeData } from '../../_store/local'
    import { get } from '../../_utils/lodash-lite'

    export let realm
    export let newBubble
    export let digitalArtId = ''
    export let payload

    // suppress warnings
    const intl = {}

    if (!payload) {
      payload = {
        name: '',
        type: 'DigitalArt',
        description: '',
        maxEdition: 1,
        content: null
      }
    }

    $: formLabel = newBubble ? 'intl.newBubble' : 'intl.editBubble'
    $: buttonLabel = newBubble ? 'intl.createBubbleButton' : 'intl.editBubbleButton'
    $: buttonDisabled = !payload.name || $digitalArtOperationInProgress
    
    async function onSubmit (event) {
      event.preventDefault()
      event.stopPropagation()

      payload.content = get(composeData.get(), [$currentInstance, realm, 'image', 'data'], {})
      await saveDigitalArt(realm, digitalArtId, payload)
      setComposeData(realm, {})

      if ($digitalArtOperationError) {
        return
      }

      goto('/studio')
    }
</script>
  
  <FreeTextLayout>
      <div class="digitalArt-form-box">
          <form on:submit='{onSubmit}' aria-label="{formLabel}">
  
              <ErrorMessage error={$digitalArtOperationError} />
  
              <label for="name">{intl.DigitalArtNameColon}</label>
              <input type="text" autocapitalize="none" id="name"
                     bind:value='{payload.name}' placeholder="{intl.enterDigitalArtName}" required
              >
  
              <label for="description">{intl.DigitalArtDescriptionColon}</label>
              <textarea id="description"
                        class="compose-description-input"
                        placeholder="{intl.enterDigitalArtDescription}"
                        bind:value={payload.description}
              ></textarea>
              <label for="maxEditions">{intl.DigitalArtMaxEditionsColon}</label>
              <input type="number" autocapitalize="none" id="maxEditions"
                     bind:value={payload.maxEdition} placeholder="{intl.enterDigitalArtMaxEditions}" required
              >
              <label for="image">{intl.DigitalArtImageColon}</label>
              <MediaField {realm} field="image" elementId="image" buttonLabel="{intl.addAvatarImage}" mediaProfile="public_asset" />
  
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
  
      input[type="text"] {
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
  
      label, input, textarea, button, :global(.digitalArt-form-box-aside) {
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
          input[type="text"] {
              min-width: 95%;
          }
      }
  
  </style>
  