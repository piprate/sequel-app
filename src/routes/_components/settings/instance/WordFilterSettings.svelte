<script>
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import IconButton from '../../IconButton.svelte'
  import { instanceFilters } from '../../../_store/local'
  import { LOCALE } from '../../../_static/intl'
  import { importShowWordFilterDialog } from '../../dialog/asyncDialogs/importShowWordFilterDialog'
  import { deleteFilter } from '../../../_actions/filters'
  import { thunk } from '../../../_utils/thunk'

  export let instanceName

  const intl = {}

  const listFormat = thunk(() => new Intl.ListFormat(LOCALE, { style: 'long', type: 'conjunction' }))

  $: filters = $instanceFilters[instanceName] || []

  $: formattedFilters = filters.map((filter) => ({
    ...filter,
    formattedContexts: listFormat().format(
      filter.context.map((context) => {
        switch (context) {
          case 'home':
            return 'intl.filterHome'
          case 'notifications':
            return 'intl.filterNotifications'
          case 'public':
            return 'intl.filterPublic'
          case 'thread':
            return 'intl.filterThread'
          case 'spark':
            return 'intl.filterSpark'
          default:
            return 'intl.filterUnknown'
        }
      })
    )
  }))

  async function add() {
    const showWordFilterDialog = await importShowWordFilterDialog()
    await showWordFilterDialog({ instanceName })
  }

  async function edit(filter) {
    const showWordFilterDialog = await importShowWordFilterDialog()
    await showWordFilterDialog({ instanceName, filter })
  }

  async function del(filter) {
    await deleteFilter(instanceName, filter.id)
  }
</script>

<div class="generic-instance-settings word-filters">
  {#if filters.length}
    <table class="word-filters-table">
      <thead>
        <tr>
          <th>{intl.wordOrPhrase}</th>
          <th>{intl.contexts}</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {#each formattedFilters as filter (filter.id)}
          <tr>
            <td class="word-filters-break">{filter.phrase}</td>
            <td class="word-filters-break">{filter.formattedContexts}</td>
            <td>
              <IconButton label={intl.edit} href="#fa-pencil" on:click={() => edit(filter)} clickListener={true} />
            </td>
            <td>
              <IconButton label={intl.delete} href="#fa-trash" on:click={() => del(filter)} clickListener={true} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="word-filters-p">{intl.noFilters}</p>
  {/if}
  <button type="button" on:click={add}>{intl.addFilter}</button>
</div>
<GenericInstanceSettingsStyle />

<style>
  .word-filters-table {
    width: 100%;
  }
  p.word-filters-p,
  .word-filters-table {
    margin: 0 0 10px 0;
  }

  .word-filters-break {
    word-break: break-word;
    text-overflow: ellipsis;
  }

  @media (max-width: 767px) {
    .word-filters-table {
      table-layout: fixed;
    }
  }
</style>
