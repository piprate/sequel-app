<script>
  import ModalDialog from './ModalDialog.svelte'
  import Avatar from '../../Avatar.svelte'
  import SvgIcon from '../../SvgIcon.svelte'
  import RadioGroup from '../../radio/RadioGroup.svelte'
  import RadioGroupButton from '../../radio/RadioGroupButton.svelte'
  import WorldDisplayName from '../../world/WorldDisplayName.svelte'
  import FlowConnect from '../../flow/FlowConnect.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher } from 'svelte'
  import { currentInstance, flowLoggedInAccount, instanceUsers } from '../../../_store/local'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { toast } from '../../toast/toast'
  import { readNFTCollection } from '../../../_actions/flow'
  import LoadingSpinner from '../../LoadingSpinner.svelte'

  export let id
  export let label
  export let selectedNFT = ''

  const dispatch = createEventDispatcher()

  let loadingNFTs = false

  let rootSelectionTree = {
    id: 'root',
    name: '',
    summary: '',
    type: 'folder',
    loaded: true,
    folderList: [
      {
        id: 'sequel',
        name: 'Sequel',
        summary: 'Digital Art',
        type: 'source',
        loaded: false,
        nftList: []
      },
      {
        id: 'metaverse',
        name: 'Metaverse',
        summary: 'NFTs from Metaverse',
        type: 'folder',
        loaded: false,
        folderList: [
          {
            id: 'versus',
            name: 'Versus',
            type: 'source',
            summary: 'https://www.versus.auction',
            loaded: false,
            nftList: []
          },
          {
            id: 'xtingles',
            name: 'xtingles',
            type: 'source',
            summary: 'https://xtingles.com',
            notSupported: true,
            loaded: false,
            nftList: []
          }
        ]
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
  $: nftCount = currentSelectionTree.nftList && currentSelectionTree.nftList.length
  $: enableBackButton = selectionHistory.length > 0

  function onClick (nft) {
    if (nft.id === '') {
      dispatch('select', null)
    } else {
      dispatch('select', nft)
    }
    close(id)
  }

  async function onFolderClick (folder) {
    selectionHistory.push(currentSelectionTree)
    // cause variable refresh
    selectionHistory = selectionHistory

    currentSelectionTree = folder

    if (folder.type !== 'folder' && !folder.loaded) {
      loadingNFTs = true
      try {
        folder.nftList = await readNFTCollection(folder.id, flowAddress)
        if (folder.nftList == null) {
          folder.nftList = []
          folder.notSupported = true
        }
        folder.loaded = true
      } catch (e) {
        console.log(e)
        /* no await */
        toast.say(formatIntl('intl.error', { error: (e.message || '') }))
      } finally {
        loadingNFTs = false
      }
    }
  }

  function onBackClick (e) {
    currentSelectionTree = selectionHistory.pop()
    // cause variable refresh
    selectionHistory = selectionHistory
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={false}
        background="var(--main-bg)"
>
  {#if notConnectedToFlow }
    <FlowConnect className="flow-sign-in-dialog" />
  {:else}
    <RadioGroup id="nft-selector" className="world-selection-radio" label="{intl.selectWorldFromList}" length={nftCount}>
      <ul class="nft-results" aria-label="{intl.worldList}">
        {#if currentSelectionTree.type === 'folder'}
          {#if enableBackButton }
            <li class="search-result">
              <div class="search-result-back" on:click={onBackClick}>
                <div class="nft-selector-button-wrapper">
                  <SvgIcon className="nft-selector-button-svg" href="#fa-angle-left" />
                </div>
                <div class="back-label">Back</div>
              </div>
            </li>
          {/if}
          {#each currentSelectionTree.folderList as folder}
            <li class="search-result">
              <div class="search-result-nft-folder" on:click={(e) => onFolderClick(folder)}>
                <div class="nft-folder-name">{folder.name} {#if folder.loaded} ({folder.nftList.length}){/if}</div>
                <div class="nft-folder-summary">{folder.summary}</div>
                <div class="nft-selector-button-wrapper">
                  <SvgIcon className="nft-selector-button-svg" href="#fa-angle-right" />
                </div>
              </div>
            </li>
          {/each}
        {:else}
          {#if enableBackButton }
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
          {:else}
            {#if currentSelectionTree.nftList.length > 0}
              {#each currentSelectionTree.nftList as nft, idx}
                <li class="search-result">
                  <RadioGroupButton
                          id="nft-selector={nft.id}"
                          className="nft-selector-button"
                          label={nft.name}
                          index={idx}
                          checked={nft.id === selectedNFT}
                          on:click="{ (e) => onClick(nft) }">
                    <div class="search-result-nft">
                      <div class="search-result-nft-image">
                        <Avatar entity={nft} size="small" secure={true} />
                      </div>
                      <div class="search-result-nft-name">
                        <WorldDisplayName world={nft} />
                      </div>
                      <div class="search-result-nft-username">
                        {nft.token}
                      </div>
                      <div class="nft-selector-button-wrapper">
                        <SvgIcon className="nft-selector-button-svg {nft.selected ? '' : 'hidden'}"
                                 href="#fa-check" />
                      </div>
                    </div>
                  </RadioGroupButton>
                </li>
              {/each}
            {:else}
              <div class="search-result-nft">
                <div class="search-result-not-found">{currentSelectionTree.notSupported ? 'intl.nftSourceNotSupported' : 'intl.noNFTsFound'}</div>
              </div>
            {/if}
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
  :global(.world-selection-radio) {
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
      "name     button"
      "summary  button";
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
      "nft-image    name     button"
      "nft-image    username button";
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
    grid-template-areas: "button label";
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