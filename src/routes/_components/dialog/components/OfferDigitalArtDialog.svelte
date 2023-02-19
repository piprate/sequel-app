<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { updateDigitalArt } from '../../../_actions/digitalArt'
  import { getEvergreenTemplates } from '../../../_api/evergreenTemplates'
  import { getMarketplaceReleases } from '../../../_api/releases'
  import { finaliseOffer } from '../../../_api/studio'
  import { accessToken, currentSparkId } from '../../../_store/instance'
  import { currentInstance } from '../../../_store/local'
  import { formatIntl } from '../../../_utils/formatIntl'
  import ErrorMessage from '../../ErrorMessage.svelte'
    import EvergreenProfile from '../../marketplace/EvergreenProfile.svelte';
  import SelectorControl from '../../SelectorControl.svelte'
  import { toast } from '../../toast/toast'
  import { importShowSparkSelectionDialog } from '../asyncDialogs/importShowSparkSelectionDialog'
  import { close } from '../helpers/closeDialog'
  import ModalDialog from './ModalDialog.svelte'

  export let id
  export let label
  export let digitalArt

  const digitalArtId = $page.params.id
  let spark
  let error
  let loading = false

  const realm = 'offerDigitalArtDialog'
  const title = label
  let releases = []
  let evergreenTemplates = []
  let customEvergreenProfile = {
    description: '',
    id: '',
    roles: []
  }

  const payload = {
    unitPrice: null,
    currency: 'Flow',
    evergreenProfile: '',
    maxEditions: digitalArt.maxEdition,
    release: '',
    roleMapping: null,
    scope: 'public',
    scopeSubject: ''
  }

  $: {
    if (spark) payload.scopeSubject = spark.id
  }

  let selectedTemplate

  $: {
    if (selectedTemplate?.id !== payload.evergreenProfile) {
      evergreenTemplates.forEach(template => {
        if (template.id === payload.evergreenProfile) {
          selectedTemplate = template

          customEvergreenProfile = {
            id: template.id,
            description: template.description,
            roles: template.roles
          }

          const roles = template.roles.filter(
            role => !['Artist', 'Platform'].includes(role.id)
          )

          if (roles.length) {
            for (const role of roles) {
              payload.roleMapping = {
                [role.id]: {
                  addr: '',
                  description: ''
                }
              }
            }
          } else {
            payload.roleMapping = null
          }
        }
      })
    }
  }

  onMount(() => {
    getMarketplaceReleases(
      $currentInstance,
      $accessToken,
      $currentSparkId
    ).then(res => { releases = res })

    getEvergreenTemplates($currentInstance, $accessToken, $currentSparkId).then(
      res => {
        evergreenTemplates = res
        payload.evergreenProfile = evergreenTemplates[0].id
      })
  })

  async function onSparkSelectorClick () {
    const showDialog = await importShowSparkSelectionDialog()
    showDialog(
      payload.scopeSubject,
      function (event) {
        spark = event.detail
        payload.scopeSubject = (spark && spark.id) || ''
      },
      '',
      'intl.searchSpark',
      realm
    )
  }

  const preventNoReleaseSelect = (event) => {
    if (event.target.value === '') {
        payload.release = payload.release
    }
  }

  const finalise = async () => {
    try {
      loading = true
      const response = await finaliseOffer(
        $currentInstance,
        $accessToken,
        digitalArtId,
        payload,
        $currentSparkId
      )
      updateDigitalArt(digitalArtId)
      toast.say(formatIntl('intl.offerAvailable', { digitalArt: digitalArt.name }))
      goto(`/marketplace/${response.id}`)
      close(id)
    } catch (err) {
      error = err
    } finally {
      loading = false
    }
  }
</script>

<ModalDialog
  {id}
  {label}
  {title}
  shrinkWidthToFit={false}
  background="var(--main-bg)"
>
  <form method="post" on:submit|preventDefault={finalise}>
    <ErrorMessage error={error} />
    <div id="unit-price" class="field">
      <label for="unit-price-input">Unit Price</label>
      <input
        required
        type="number"
        id="unit-price-input"
        name="unitPrice"
        step="0.01"
        min="0.01"
        pattern="^[+-]?\d+(\.\d+)?$"
        bind:value={payload.unitPrice}
      />
    </div>
    <div id="currency" class="field">
      <label for="currency-input">Currency</label>
      <select name="currency" id="currency-input" bind:value={payload.currency}>
        <option value="Flow">Flow</option>
        <option value="FUSD">FUSD</option>
      </select>
    </div>
    <div id="max-editions" class="field">
      <label for="max-editions-input">Max Editions</label>
      <select
        name="maxEditions"
        id="max-editions-input"
        bind:value={payload.maxEditions}
      >
        {#each Array(digitalArt.maxEdition) as _, index}
          <option value={index + 1}>{index + 1}</option>
        {/each}
      </select>
    </div>
    <div id="release" class="field">
      <label for="release-input">Release</label>
      <select name="release" id="release-input" bind:value={payload.release} on:input={preventNoReleaseSelect}>
        <option value="" disabled>No Release</option>
        {#each releases as release}
          <option value={release}>{release.name}</option>
        {/each}
      </select>
    </div>
    <div id="evergreen-profile" class="field">
      <label for="evergreen-profile-input">Evergreen Profile</label>
      <select
        name="evergreenProfile"
        id="evergreen-profile-input"
        bind:value={payload.evergreenProfile}
      >
        {#each evergreenTemplates as { id, name }}
          <option value={id}>{name}</option>
        {/each}
      </select>
      {#if payload.evergreenProfile}
        <EvergreenProfile profile={customEvergreenProfile} title='' />
      {/if}
    </div>
    {#if payload.roleMapping}
      <div id="role-mapping" class="field">
        <label for="role-mapping-input">Role Mapping</label>
        <table>
          <thead>
            <tr>
              <th scope='col' colspan="0">Role</th>
              <th scope='col' colspan="2" id="role-address-heading">Address</th>
              <th scope='col' colspan="1" id="description-heading">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(payload.roleMapping) as [id, role]}
              <tr>
                <th scope='row' colspan="0">{id}</th>
                <td colspan="2">
                  <div>
                    <input
                      type="text"
                      id="address-input"
                      aria-labelledby="role-address-heading"
                      bind:value={payload.roleMapping[id].addr}
                    />
                  </div>
                </td>
                <td colspan="1">
                    <textarea
                      id="description-input"
                      aria-labelledby="role-description-heading"
                      minlength="1"
                      maxlength="120"
                      rows="1"
                      bind:value={payload.roleMapping[id].description}
                    />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <div id="exclusivity-scope" class="field">
      <label for="exclusivity-scope-input">Audience</label>
      <select
        name="scope"
        id="exclusivity-scope-input"
        bind:value={payload.scope}
      >
        <option value="public">Public</option>
        <option value="spark">Spark</option>
      </select>
    </div>
    {#if payload.scope === 'spark'}
      <div id="exclusivity-subject" class="field">
        <SelectorControl
          label="Exclusive to Spark"
          buttonLabel="change"
          itemName={spark?.name}
          on:click={onSparkSelectorClick}
        />
      </div>
    {/if}
    <div class="actions">
      <button type="button" on:click={() => close(id)}>CANCEL</button>
      <button type="submit" class="primary" disabled={loading}>FINALISE</button>
    </div>
  </form>
</ModalDialog>

<style lang="scss">

  form {
    padding: 2rem 1rem;
    max-height: 80vh;
    overflow: auto;
  }
  
  @media (min-width: 768px) {
    form {
      padding: 2rem 3rem;
    }
  }

  .field {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
      margin-bottom: 0.25rem;
    }

    select {
      border: 1px solid var(--input-border);
      background-color: transparent;
      padding: 0.5rem;
      font-size: 1rem;
    
      option {
        background-color: var(--main-bg);
        font-size: 1rem;
        padding: 4px 0;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem
  }

  #role-mapping table {
    margin: 1rem 0;

    th,td {
      border: 1px solid var(--input-border);
    }

    th {
      text-align: left;
      font-size: 1.05rem;
    }

    th[scope='row'] {
      padding: 0.25rem 1rem;
    }
    
    td {  
      input,textarea {
        width: 100%;
        min-height: 35px;
      }
    }

    border-collapse: collapse;
  }
</style>
