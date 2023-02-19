<script>
    import ModalDialog from './ModalDialog.svelte'
    import Avatar from '../../Avatar.svelte'
    import SvgIcon from '../../SvgIcon.svelte'
    import RadioGroup from '../../radio/RadioGroup.svelte'
    import RadioGroupButton from '../../radio/RadioGroupButton.svelte'
    import SparkDisplayName from '../../spark/SparkDisplayName.svelte'
    import { close } from '../helpers/closeDialog'
    import { createEventDispatcher } from 'svelte'
    import { queryInSearch, searchResults } from '../../../_store/local'
    import { formatIntl } from '../../../_utils/formatIntl'
    import { currentComposeRealm, rootComposeFocused, setForCurrentAutosuggest } from '../../../_store/autosuggest';
    import { scheduleIdleTask } from '../../../_utils/scheduleIdleTask';
    import { get } from '../../../_utils/lodash-lite';
    import { doSearch } from '../../../_actions/search';
    import { onMount } from 'svelte';
  
    export let id
    export let realm
    export let label
    export let title
    export let selectedSpark

    onMount(()=> {
      searchResults.set(null)
    })
    
    $: sparks = get($searchResults, ['sparks'], []) 

    const dispatch = createEventDispatcher()
  
    $: sparkStates = sparks.map((spark, index) => ({
        id: spark.id,
        index,
        name: spark.name,
        selected: (selectedSpark === spark.id),
        label: formatIntl('intl.selectedSparkLabel', { spark: spark.name, selected: (selectedSpark === spark.id) }),
        switchLabel: formatIntl('intl.switchToNameOfSpark', { spark: spark.name }),
        data: spark
    }))

    function onClick (world) {
        dispatch('select', world.id === ''? null : world)
        close(id)
    }
    
    const onFocus = () => {
        scheduleIdleTask(() => {
            currentComposeRealm.set(realm);
            setForCurrentAutosuggest(rootComposeFocused, true);
        })
    }

    const onSubmit = () => {
      doSearch('Spark')
    }
  </script>
  
<ModalDialog
    {id}
    {label}
    {title}
    background="var(--main-bg)"
>
    <form on:submit|preventDefault|stopPropagation={onSubmit}>
      <div id='search-spark'>
        <label for="search-input">Search Spark</label>
        <input type="search" name="spark" id="search-input" bind:value={$queryInSearch} on:focus={onFocus}>
      </div>
    </form>
    {#if sparks && sparks.length}
    <RadioGroup id="spark-selector" className="spark-selection-radio" label="{intl.selectSparkFromList}" length={sparks.length}>
      <ul class="sparks-results" aria-label="{intl.sparkList}">
        {#each sparkStates as spark}
        <li class="search-sparks">
          <RadioGroupButton
          id="spark-selector={spark.id}"
                      className="spark-selector-button"
                      label={spark.switchLabel}
                      checked={spark.selected}
                      index={spark.index}
                      on:click={() => onClick(spark)}>
                      <div class="search-sparks-spark">
                        {#if spark.id}
                        <div class="search-sparks-spark-avatar">
                          <Avatar entity={spark.data} size="small" />
                        </div>
                        <div class="search-sparks-spark-name">
                          <SparkDisplayName spark={spark.data} />
                        </div>
                        <div class="search-sparks-spark-stats">
                          Posts: {spark.data.postCount || 0} Bubbles: {spark.data.bubbleCount || 0}
                        </div>
                        <div class="search-sparks-spark-summary">
                          {spark.data.summary ?
                            spark.data.summary.length > 250 ?
                            spark.data.summary.substring(0, 250) + "..." : spark.data.summary
                            : ''}
                  </div>
                  {:else}
                  <div class="spark-not-assigned">{intl.sparkNotAssigned}</div>
                  {/if}
                  <div class="spark-selector-button-wrapper">
                    <SvgIcon className="spark-selector-button-svg {spark.selected ? '' : 'hidden'}"
                    href="#fa-check" />
                  </div>
                </div>
              </RadioGroupButton>
            </li>
            {/each}
          </ul>
      </RadioGroup>
    {:else}
      <div class="no-results">
        No Sparks Found
      </div>
     {/if}
</ModalDialog>
    
<style>
    #search-spark {
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    label {
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .no-results, .loading {
      display: grid;
      place-items: center;
      font-size: 1.5rem;
      margin: 4rem 0;
    }

    .search-sparks {
      box-sizing: border-box;
      border-bottom: 1px solid var(--main-border);
      display: flex;
      min-height: 74px;
      background: var(--settings-list-item-bg);
    }
    .search-sparks:last-child {
      border-bottom: none;
    }
    .search-sparks:hover {
      background: var(--settings-list-item-bg-hover);
    }
    :global(.spark-selection-radio) {
      width: 100%;
      max-height: calc(100% - 45px);
      overflow-y: auto;
    }
    .sparks-results {
      list-style: none;
      box-sizing: border-box;
      border: 1px solid var(--main-border);
      border-radius: 2px;
    }
    .spark-selector-button-wrapper {
      position: relative;
      grid-area: button;
    }
    :global(.spark-selector-button) {
      display: flex;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      border: none;
      background: none;
      align-items: center;
      justify-content: center;
      margin: 1px;
    }
    :global(.spark-selector-button-svg) {
      width: 32px;
      height: 32px;
      display: inline-block;
      fill: var(--svg-fill);
    }
    .search-sparks-spark {
      flex: 1;
      display: grid;
      grid-template-areas:
        "avatar    name     button"
        "avatar    stats    button"
        "summary   summary  button";
      grid-column-gap: 20px;
      grid-template-columns: max-content 1fr max-content;
      align-items: center;
      text-align: left;
      font-size: 14px;
    }
    :global(.search-sparks-spark-avatar) {
      grid-area: avatar;
    }
    .search-sparks-spark-name {
      grid-area: name;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 1.2em;
    }
    .search-sparks-spark-stats {
      grid-area: stats;
      color: var(--very-deemphasized-text-color);
    }
    .search-sparks-spark-summary {
      margin-top: 5px;
      grid-area: summary;
      color: var(--deemphasized-text-color);
    }
    .spark-not-assigned {
      grid-area: avatar;
      font-size: 1.2em;
    }
    @media (max-width: 767px) {
      .search-sparks-spark {
        grid-column-gap: 10px;
      }
    }
  </style>