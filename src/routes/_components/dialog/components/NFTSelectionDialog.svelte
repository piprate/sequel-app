<script>
  import ModalDialog from './ModalDialog.svelte'
  import Avatar from '../../Avatar.svelte'
  import SvgIcon from '../../SvgIcon.svelte'
  import RadioGroup from '../../radio/RadioGroup.svelte'
  import RadioGroupButton from '../../radio/RadioGroupButton.svelte'
  import EntityDisplayName from '../../EntityDisplayName.svelte'
  import FlowConnect from '../../flow/FlowConnect.svelte'
  import LoadingSpinner from '../../LoadingSpinner.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher, onMount } from 'svelte'
  import { currentInstance, flowLoggedInAccount, instanceUsers, isUserLoggedIn } from '../../../_store/local'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { toast } from '../../toast/toast'
  import { readNFTCollection, readNFTCollections } from '../../../_actions/flow'

  export let id
  export let label
  export let currentSource = undefined
  export let currentToken = undefined

  const dispatch = createEventDispatcher()

  let loadingNFTs = false

  let rootSelectionTree = {
    id: 'root',
    name: '',
    summary: '',
    type: 'folder',
    nftCount: 0,
    folderList: [
      {
        id: 'sequel',
        name: 'Sequel',
        summary: 'Digital Art',
        type: 'source',
        nftList: [],
        nftCount: 0
      }
    ]
  }

  let currentSelectionTree = rootSelectionTree
  let selectionHistory = []

  $: title = currentSelectionTree.type === 'folder' ? 'intl.nftSelectionFolderTitle' : 'intl.nftSelectionTitle'
  $: user = ($instanceUsers && $instanceUsers[$currentInstance]) || {}
  $: flowAddress = (user && user.flow && user.flow.addr) || ''
  $: flowNetwork = (user && user.flow && user.flow.network) || ''
  $: flowAddressMismatch = $flowLoggedInAccount && flowAddress && $flowLoggedInAccount !== flowAddress
  $: notConnectedToFlow = !flowAddress || flowAddressMismatch || $flowLoggedInAccount !== flowAddress
  $: nftCount = currentSelectionTree.nftCount || 0
  $: enableBackButton = selectionHistory.length > 0

  function onClick(nft) {
    if (nft.id === '') {
      dispatch('select', null)
    } else {
      dispatch('select', nft)
    }
    close(id)
  }

  async function onFolderClick(folder) {
    selectionHistory.push(currentSelectionTree)
    // cause variable refresh
    selectionHistory = selectionHistory

    currentSelectionTree = folder

    if (folder.type !== 'folder') {
      loadingNFTs = true
      try {
        folder.nftList = await readNFTCollection(folder.id, flowAddress)
        if (folder.nftList == null) {
          folder.nftList = []
          folder.nftCount = 0
        } else {
          folder.nftCount = folder.nftList.length
        }
        folder.loaded = true
      } catch (e) {
        console.log(e)
        /* no await */
        toast.say(formatIntl('intl.error', { error: e.message || '' }))
      } finally {
        loadingNFTs = false
      }
    }
  }

  function isCurrent(nft) {
    return nft.source === currentSource && nft.token === currentToken
  }

  function onBackClick(e) {
    currentSelectionTree = selectionHistory.pop()
    // cause variable refresh
    selectionHistory = selectionHistory
  }

  onMount(async () => {
    if ($isUserLoggedIn && flowAddress) {
      let collections
      loadingNFTs = true
      try {
        collections = await readNFTCollections(flowAddress)
      } catch (e) {
        console.log(e)
        /* no await */
        toast.say(formatIntl('intl.error', { error: e.message || '' }))
      } finally {
        loadingNFTs = false
      }
      console.log('Loaded collections', collections)

      let flowverseCount = 0
      for (const col of collections) {
        flowverseCount += col.nftCount
      }

      rootSelectionTree.folderList.push({
        id: 'flowverse',
        name: 'Flowverse',
        summary: 'NFTs from Flowverse',
        type: 'folder',
        folderList: collections,
        nftCount: flowverseCount
      })

      console.log('Root Tree', rootSelectionTree)

      currentSelectionTree = rootSelectionTree
    }
  })
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={false} background="var(--main-bg)">
  {#if notConnectedToFlow}
    <FlowConnect className="flow-sign-in-dialog" />
  {:else}
    <RadioGroup id="nft-selector" className="nft-selection-radio" label={intl.selectNFTFromList} length={nftCount}>
      <ul class="nft-results" aria-label={intl.nftList}>
        {#if currentSelectionTree.type === 'folder'}
          {#if enableBackButton}
            <li class="search-result">
              <div class="search-result-back" on:click={onBackClick}>
                <div class="nft-selector-button-wrapper">
                  <SvgIcon className="nft-selector-button-svg" href="#fa-angle-left" />
                </div>
                <div class="back-label">Back</div>
              </div>
            </li>
          {/if}
          {#if currentSelectionTree.folderList.length > 0}
            {#each currentSelectionTree.folderList as folder}
              <li class="search-result">
                <div class="search-result-nft-folder" on:click={(e) => onFolderClick(folder)}>
                  <div class="nft-folder-name">{folder.name} ({folder.nftCount || 0})</div>
                  <div class="nft-folder-summary">{folder.summary}</div>
                  <div class="nft-selector-button-wrapper">
                    <SvgIcon className="nft-selector-button-svg" href="#fa-angle-right" />
                  </div>
                </div>
              </li>
            {/each}
          {:else}
            <div class="search-result-nft">
              <div class="search-result-not-found">{intl.noNFTsFound}</div>
            </div>
          {/if}
        {:else}
          {#if enableBackButton}
            <li class="search-result">
              <div class="search-result-back" on:click={onBackClick}>
                <div class="nft-selector-button-wrapper">
                  <SvgIcon className="nft-selector-button-svg" href="#fa-angle-left" />
                </div>
                <div class="back-label">Back</div>
              </div>
            </li>
          {/if}
          {#if loadingNFTs}
            <div class="loading-nft-collection">
              <LoadingSpinner />
            </div>
          {:else if currentSelectionTree.nftCount > 0}
            {#each currentSelectionTree.nftList as nft, idx}
              <li class="search-result">
                <RadioGroupButton
                  id="nft-selector={nft.id}"
                  className="nft-selector-button"
                  label={nft.name}
                  index={idx}
                  checked={isCurrent(nft)}
                  on:click={(e) => onClick(nft)}
                >
                  <div class="search-result-nft">
                    <div class="search-result-nft-image">
                      <Avatar entity={nft} size="small" secure={false} />
                    </div>
                    <div class="search-result-nft-name">
                      <EntityDisplayName entity={nft} />
                    </div>
                    <div class="search-result-nft-username">
                      {nft.token}
                    </div>
                    <div class="nft-selector-button-wrapper">
                      <SvgIcon className="nft-selector-button-svg {isCurrent(nft) ? '' : 'hidden'}" href="#fa-check" />
                    </div>
                  </div>
                </RadioGroupButton>
              </li>
            {/each}
          {:else}
            <div class="search-result-nft">
              <div class="search-result-not-found">{'intl.noNFTsFound'}</div>
            </div>
          {/if}
        {/if}
      </ul>
    </RadioGroup>
  {/if}
</ModalDialog>

<style>
  :global(.flow-sign-in-dialog) {
    margin: 20px;
  }
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
  :global(.nft-selection-radio) {
    width: 100%;
  }
  .nft-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  .nft-selector-button-wrapper {
    position: relative;
    grid-area: button;
  }
  :global(.nft-selector-button) {
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
  :global(.nft-selector-button-svg) {
    width: 32px;
    height: 32px;
    display: inline-block;
    fill: var(--svg-fill);
  }
  .search-result-nft-folder {
    flex: 1;
    display: grid;
    grid-template-areas:
      'name     button'
      'summary  button';
    grid-column-gap: 10px;
    grid-template-columns: auto 30px;
    align-items: center;
    text-align: left;
    font-size: 14px;
  }
  .nft-folder-name {
    margin-left: 10px;
    grid-area: name;
    font-size: 1.2em;
  }
  .nft-folder-summary {
    margin-left: 10px;
    grid-area: summary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--deemphasized-text-color);
  }
  .search-result-nft {
    flex: 1;
    display: grid;
    grid-template-areas:
      'nft-image    name     button'
      'nft-image    username button';
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    text-align: left;
    font-size: 14px;
  }
  :global(.search-result-nft-image) {
    grid-area: nft-image;
  }
  .search-result-nft-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .search-result-nft-username {
    grid-area: username;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--deemphasized-text-color);
  }
  .search-result-back {
    flex: 1;
    display: grid;
    grid-template-areas: 'button label';
    grid-column-gap: 10px;
    grid-template-columns: 30px auto;
    align-items: center;
    text-align: left;
    font-size: 14px;
  }
  .search-result-not-found {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
    text-align: center;
    margin: 20px;
  }
  .back-label {
    grid-area: label;
    font-size: 1.2em;
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
  .loading-nft-collection {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition: opacity 0.25s linear;
  }
  @media (max-width: 767px) {
    .search-result-nft {
      grid-column-gap: 10px;
    }
  }
</style>
