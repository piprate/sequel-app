<script>
  import ModalDialog from './ModalDialog.svelte'
  import LoadingPage from '../../LoadingPage.svelte'
  import Avatar from '../../Avatar.svelte'
  import SvgIcon from '../../SvgIcon.svelte'
  import RadioGroup from '../../radio/RadioGroup.svelte'
  import RadioGroupButton from '../../radio/RadioGroupButton.svelte'
  import WorldDisplayName from '../../world/WorldDisplayName.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher, onMount } from 'svelte'
  import { currentInstance } from '../../../_store/local'
  import { getWorldList } from '../../../_api/worlds'
  import { accessToken } from '../../../_store/instance'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { displayError } from '../../../_actions/errors'

  export let id
  export let label
  export let title
  export let selectedWorld

  const dispatch = createEventDispatcher()

  let loading = true
  let worlds = []

  function onClick(world) {
    if (world.id === '') {
      dispatch('select', null)
    } else {
      dispatch('select', world)
    }
    close(id)
  }

  $: worldStates = worlds.map((world, index) => ({
    id: world.id,
    index,
    name: world.name,
    selected: selectedWorld === world.id,
    label: formatIntl('intl.selectedWorldLabel', { world: world.name, selected: selectedWorld === world.id }),
    switchLabel: formatIntl('intl.switchToNameOfWorld', { world: world.name }),
    data: world
  }))

  onMount(async () => {
    try {
      worlds = [
        {
          id: '' // entry for 'Not assigned' option
        }
      ].concat(await getWorldList($currentInstance, $accessToken))
    } catch (e) {
      displayError(e)
    } finally {
      loading = false
    }
  })
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={true} background="var(--main-bg)">
  {#if loading}
    <LoadingPage />
  {:else if worlds && worlds.length}
    <RadioGroup
      id="world-selector"
      className="world-selection-radio"
      label={intl.selectWorldFromList}
      length={worlds.length}
    >
      <ul class="worlds-results" aria-label={intl.worldList}>
        {#each worldStates as world}
          <li class="search-result">
            <RadioGroupButton
              id="world-selector={world.id}"
              className="world-selector-button"
              label={world.switchLabel}
              checked={world.selected}
              index={world.index}
              on:click={(e) => onClick(world)}
            >
              <div class="search-result-world">
                {#if world.id}
                  <div class="search-result-world-avatar">
                    <Avatar entity={world.data} size="small" />
                  </div>
                  <div class="search-result-world-name">
                    <WorldDisplayName world={world.data} />
                  </div>
                  <div class="search-result-world-stats">
                    Posts: {world.data.postCount || 0} Bubbles: {world.data.bubbleCount || 0} Members: {world.data
                      .memberCount || 0}
                  </div>
                  <div class="search-result-world-summary">
                    {world.data.summary
                      ? world.data.summary.length > 250
                        ? world.data.summary.substring(0, 250) + '...'
                        : world.data.summary
                      : ''}
                  </div>
                {:else}
                  <div class="world-not-assigned">{intl.worldNotAssigned}</div>
                {/if}
                <div class="world-selector-button-wrapper">
                  <SvgIcon className="world-selector-button-svg {world.selected ? '' : 'hidden'}" href="#fa-check" />
                </div>
              </div>
            </RadioGroupButton>
          </li>
        {/each}
      </ul>
    </RadioGroup>
  {:else}
    no worlds found
  {/if}
</ModalDialog>

<style>
  .search-result {
    box-sizing: border-box;
    border-bottom: 1px solid var(--main-border);
    display: flex;
    min-height: 74px;
    background: var(--settings-list-item-bg);
  }
  .search-result:last-child {
    border-bottom: none;
  }
  .search-result:hover {
    background: var(--settings-list-item-bg-hover);
  }
  :global(.world-selection-radio) {
    width: 100%;
    max-height: calc(100% - 45px);
    overflow-y: auto;
  }
  .worlds-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  .world-selector-button-wrapper {
    position: relative;
    grid-area: button;
  }
  :global(.world-selector-button) {
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
  :global(.world-selector-button-svg) {
    width: 32px;
    height: 32px;
    display: inline-block;
    fill: var(--svg-fill);
  }
  .search-result-world {
    flex: 1;
    display: grid;
    grid-template-areas:
      'avatar    name     button'
      'avatar    stats    button'
      'summary   summary  button';
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    text-align: left;
    font-size: 14px;
  }
  :global(.search-result-world-avatar) {
    grid-area: avatar;
  }
  .search-result-world-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .search-result-world-stats {
    grid-area: stats;
    color: var(--very-deemphasized-text-color);
  }
  .search-result-world-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
  }
  .world-not-assigned {
    grid-area: avatar;
    font-size: 1.2em;
  }
  @media (max-width: 767px) {
    .search-result-world {
      grid-column-gap: 10px;
    }
  }
</style>
