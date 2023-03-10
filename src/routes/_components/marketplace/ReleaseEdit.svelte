<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import { saveRelease, updateRelease } from '../../_actions/marketplace'
  import { goto } from '$app/navigation'
  import ErrorMessage from '../ErrorMessage.svelte'
  import { onMount } from 'svelte'
  import { isUserLoggedIn, setComposeData } from '../../_store/local'
  import { unwrap } from '../../_utils/mapper'
  import LoadingSpinner from '../LoadingSpinner.svelte'

  export let realm
  export let releaseId = ''
  $: newRelease = !releaseId

  // suppress warnings
  const intl = {}

  let payload = {
    endTime: '',
    name: '',
    seller: '',
    startTime: '',
    status: 'draft',
    summary: '',
    summaryFormat: 'txt',
    type: 'MarketplaceRelease'
  }

  onMount(async () => {
    const makeDateEditable = (date) => {
      if (!date) {
        return undefined
      }

      const dateParts = new Date(date).toISOString().split(':')
      dateParts.pop()
  
      return dateParts.join(':')
    }

    if (!newRelease) {
      if ($isUserLoggedIn) {
        const release = await updateRelease(releaseId)
        payload = { ...release }
        payload.startTime = makeDateEditable(payload.startTime)
        payload.endTime = makeDateEditable(payload.endTime)
      }
    }
  })
  
  let submitting = false
  let error

  function selectStatus (event) {
    payload.status = event.target.value
  }

  $: formLabel = newRelease ? 'intl.newRelease' : 'intl.editRelease'
  $: buttonLabel = newRelease ? 'intl.create' : 'intl.update'
  $: buttonDisabled = !payload.name || submitting

  async function onSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    try {
      submitting = true
      const release = await saveRelease(realm, releaseId, payload)
      setComposeData(realm, {})
  
      goto(`/marketplace/releases/${unwrap(release.id)}`)
    } catch (err) {
      error = err
    } finally {
      submitting = false
    }
  }
</script>
  
  <FreeTextLayout>
      <div class="release-form-box">
          <form on:submit={onSubmit} aria-label="{formLabel}">
  
              <ErrorMessage error={error} />
  
              <label for="name">{intl.releaseNameColon}</label>
              <input type="text" autocapitalize="none" id="name"
                     bind:value='{payload.name}' placeholder="{intl.enterReleaseName}" required
              >
  
              <label for="summary">{intl.releaseSummaryColon}</label>
              <textarea id="summary"
                        class="compose-summary-input"
                        placeholder='{intl.enterReleaseSummary}'
                        bind:value={payload.summary}
              ></textarea>
              {#if newRelease}
                <fieldset id='status'>
                  <legend>{intl.releaseStatus}</legend>
                  <div>
                    <label for="draft-status">{intl.releaseDraftColon}</label>
                      <input type="radio" id="draft-status" name="status" value="draft" checked={payload.status === 'draft'} on:change={selectStatus} />
                    </div>
                    <div>
                      <label for="active-status">{intl.releaseActiveColon}</label>
                      <input type="radio" id="active-status" name="active" value="active" checked={payload.status === 'active'} on:change={selectStatus} />
                    </div>
                  </fieldset>
                {/if}
              <label for="start-time">{intl.releaseStartsAtColon}</label>
              <input type="datetime-local" name="startTime" id="start-time" bind:value={payload.startTime} />
              <label for="end-time">{intl.releaseEndsAtColon}</label>
              <input type="datetime-local" name="endTime" id="end-time" bind:value={payload.endTime} />

              <div class="footer">
                <a class="button" href='/marketplace/releases'>
                    {intl.cancel}
                </a>
                <button class="primary" type="submit" id="submitButton" disabled={buttonDisabled}>
                  {#if submitting}
                    <LoadingSpinner size={20} maskStyle />
                  {:else}
                    {buttonLabel}
                  {/if}
                </button>
            </div>
          </form>
      </div>
  </FreeTextLayout>
  
  <style>
      .release-form-box {
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

      fieldset {
        width: fit-content;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border: 1px solid var(--input-border);
      }

      legend {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }

      fieldset label {
        font-size: 0.875rem;
      }

      fieldset div {
        display: flex;
        gap: 0.8rem;
      }


      fieldset input, fieldset label {
        margin: 0;
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
  
      label, input, textarea, button, :global(.release-form-box-aside) {
          display: block;
          margin: 20px 5px;
      }
  
      :global(.notice-aside) {
          margin: 10px 10px 0 0;
      }
  
      @media (max-width: 320px) {
          :global(button.icon-button.release-toolbar-button) {
              padding-left: 5px;
              padding-right: 5px;
          }
      }
      @media (max-width: 240px) {
          :global(button.icon-button.release-toolbar-button .icon-button-svg) {
              width: 20px;
              height: 20px;
          }
      }
  
      @media (max-width: 767px) {
          input[type="text"] {
              min-width: 95%;
          }
      }
  
      .footer {
        display: flex;
        align-items: center;
        gap: 12px
      }

      .footer button, .footer .button {
        width: 100%;
        text-align: center;
      }
  </style>
  