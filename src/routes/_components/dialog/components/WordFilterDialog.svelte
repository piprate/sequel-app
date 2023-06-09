<script>
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'
  import Select from '../../Select.svelte'
  import {
    WORD_FILTER_CONTEXT_SPARK,
    WORD_FILTER_CONTEXT_HOME,
    WORD_FILTER_CONTEXT_NOTIFICATIONS,
    WORD_FILTER_CONTEXT_PUBLIC,
    WORD_FILTER_CONTEXT_THREAD,
    WORD_FILTER_CONTEXTS,
    WORD_FILTER_EXPIRY_DEFAULT,
    WORD_FILTER_EXPIRY_OPTIONS
  } from '../../../_static/wordFilters'
  import { createOrUpdateFilter } from '../../../_actions/filters'
  import { onMount } from 'svelte'

  export let id
  export let label
  export let title
  export let filter = undefined
  export let instanceName = undefined

  const intl = {}

  let positiveText = 'intl.save'
  let expiryOptions = WORD_FILTER_EXPIRY_OPTIONS
  let expiryDefaultValue = WORD_FILTER_EXPIRY_DEFAULT
  let confirmationButtonDisabled = false

  let filterContexts = [
    {
      label: 'intl.filterHome',
      value: WORD_FILTER_CONTEXT_HOME
    },
    {
      label: 'intl.filterNotifications',
      value: WORD_FILTER_CONTEXT_NOTIFICATIONS
    },
    {
      label: 'intl.filterPublic',
      value: WORD_FILTER_CONTEXT_PUBLIC
    },
    {
      label: 'intl.filterThread',
      value: WORD_FILTER_CONTEXT_THREAD
    },
    {
      label: 'intl.filterSpark',
      value: WORD_FILTER_CONTEXT_SPARK
    }
  ]

  let wordInput
  let expireSelectWrapper
  let contextCheckboxes
  let irreversibleCheckbox
  let wholeWordCheckbox

  function computeConfirmationButtonDisabled() {
    confirmationButtonDisabled = !(
      wordInput.value.replace(/\s+/g, '') &&
      [...contextCheckboxes.querySelectorAll('input')].some((checkbox) => checkbox.checked)
    )
  }

  function syncFilterToDom(filter) {
    if (!filter) {
      filter = {
        phrase: '',
        expires_at: WORD_FILTER_EXPIRY_DEFAULT,
        context: [...WORD_FILTER_CONTEXTS],
        irreversible: false,
        whole_word: true
      }
    }

    wordInput.value = filter.phrase

    let expiresAtValue = 0
    if (filter.expires_at) {
      const now = Date.now()
      expiresAtValue = WORD_FILTER_EXPIRY_OPTIONS.filter((_) => _.value).sort((a, b) => {
        // expires_at is an absolute timestamp, so sort by whichever one is closest given the current datetime
        const aAbsoluteTime = now + a.value * 1000
        const bAbsoluteTime = now + b.value * 1000
        const aDelta = Math.abs(new Date(filter.expires_at).getTime() - aAbsoluteTime)
        const bDelta = Math.abs(new Date(filter.expires_at).getTime() - bAbsoluteTime)
        return aDelta < bDelta ? -1 : 1
      })[0].value
    }

    expireSelectWrapper.querySelector('select').value = expiresAtValue
    for (const checkbox of [...contextCheckboxes.querySelectorAll('input')]) {
      checkbox.checked = filter.context.includes(checkbox.value)
    }
    irreversibleCheckbox.checked = !!filter.irreversible
    wholeWordCheckbox.checked = !!filter.whole_word
  }

  function syncDomToFilter() {
    const existingFilter = filter
    const newFilter = {
      id: existingFilter && existingFilter.id
    }
    newFilter.phrase = wordInput.value
    const select = expireSelectWrapper.querySelector('select')
    const selectValue = parseInt(select.value, 10)
    // When creating a new filter or updating a filter, `expires_in` is the number of seconds from now
    // that the filter expires. When reading, it's `expires_at` which is a string ISO timestamp.
    // Also, if you added a timeout for a filter, you can't change it to Never for some reason.
    newFilter.expires_in = selectValue || null
    newFilter.context = [...contextCheckboxes.querySelectorAll('input')]
      .filter((input) => input.checked)
      .map((input) => input.value)
    newFilter.irreversible = irreversibleCheckbox.checked
    newFilter.whole_word = wholeWordCheckbox.checked

    return newFilter
  }

  async function save() {
    const filter = syncDomToFilter()
    await createOrUpdateFilter(instanceName, filter)
  }

  function onWordOrPhraseChange(event) {
    computeConfirmationButtonDisabled()
  }

  function onExpiryChange(event) {}

  function onContextChange(event) {
    computeConfirmationButtonDisabled()
  }

  onMount(() => {
    syncFilterToDom(filter)
    computeConfirmationButtonDisabled()
  })
</script>

<GenericConfirmationDialog {id} {label} {title} {positiveText} {confirmationButtonDisabled} on:positive={save}>
  <div class="word-filter-dialog">
    <div class="word-filter-keyword">
      <label for="word-filter-word-or-phrase" class="word-filter-keyword-label">
        <span>{intl.wordOrPhrase}</span>
        <!-- no need for aria-label="Required", the input is already marked as required -->
        <span aria-hidden="true" class="required">*</span>
      </label>
      <input
        type="text"
        required
        autocomplete="off"
        autocapitalize="off"
        on:input={onWordOrPhraseChange}
        bind:this={wordInput}
        id="word-filter-word-or-phrase"
      />
    </div>
    <div class="word-filter-expire-after" bind:this={expireSelectWrapper}>
      <span class="word-filter-label-like word-filter-expire-label">{intl.expireAfter}</span>
      <Select
        className="word-filter-expiry-select"
        options={expiryOptions}
        defaultValue={expiryDefaultValue}
        on:change={onExpiryChange}
        label={intl.expireAfter}
      />
    </div>
    <div class="word-filter-where-to-filter">
      <span class="word-filter-label-like" id="word-filter-where-to-filter-label">
        <span>{intl.whereToFilter}</span>
        <span aria-label={intl.required} class="required">*</span>
      </span>
      <ul
        class="word-filter-radio-list"
        aria-describedby="word-filter-where-to-filter-label"
        bind:this={contextCheckboxes}
      >
        {#each filterContexts as context}
          <li>
            <input
              type="checkbox"
              name="where-to-filter"
              value={context.value}
              on:change={onContextChange}
              id="where-to-filter-{context.value}"
            />
            <label for="where-to-filter-{context.value}">{context.label}</label>
          </li>
        {/each}
      </ul>
    </div>
    <div class="word-filter-irreversible">
      <input type="checkbox" name="irreversible" bind:this={irreversibleCheckbox} id="word-filter-irreversible" />
      <label for="word-filter-irreversible">{intl.irreversible}</label>
    </div>
    <div class="word-filter-whole">
      <input type="checkbox" name="irreversible" bind:this={wholeWordCheckbox} id="word-filter-whole" />
      <label for="word-filter-whole">{intl.wholeWord}</label>
    </div>
  </div>
</GenericConfirmationDialog>

<style>
  .word-filter-dialog {
    padding: 20px 40px;
    overflow-y: auto;
    display: grid;
    grid-template-areas:
      'keyword      expire'
      'context      context'
      'irreversible whole';
    grid-row-gap: 20px;
    grid-column-gap: 10px;
  }
  .word-filter-label-like {
    font-size: 1.3em;
  }
  .word-filter-radio-list {
    list-style: none;
    margin-top: 5px;
  }
  .word-filter-keyword {
    grid-area: keyword;
  }
  .word-filter-expire-after {
    grid-area: expire;
  }
  .word-filter-where-to-filter {
    grid-area: context;
  }
  .word-filter-irreversible {
    grid-area: irreversible;
  }
  .word-filter-whole {
    grid-area: whole;
  }
  .word-filter-keyword-label,
  .word-filter-expire-label {
    margin-right: 10px;
  }
  .required {
    color: var(--warn-color);
  }
  @media (max-width: 479px) {
    .word-filter-dialog {
      grid-template-areas:
        'keyword'
        'expire'
        'context'
        'irreversible'
        'whole';
      grid-column-gap: 5px;
      grid-row-gap: 10px;
    }
  }
  @media (max-width: 320px) {
    .word-filter-dialog {
      grid-row-gap: 5px;
    }
  }
</style>
