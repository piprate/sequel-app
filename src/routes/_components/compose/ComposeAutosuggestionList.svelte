<script>
  import Avatar from '../Avatar.svelte'
  import { omitEmojiInDisplayNames, isVeryTinyMobileSize } from '../../_store/local'
  import SparkDisplayName from '../spark/SparkDisplayName.svelte'
  import { createAutosuggestAccessibleLabel } from '../../_utils/createAutosuggestAccessibleLabel'
  import SvgIcon from '../SvgIcon.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let items
  export let type
  export let selected
  export let realm

  $: ariaLabels = items.map((item, i) => {
    return createAutosuggestAccessibleLabel(type, $omitEmojiInDisplayNames, i, items)
  })

  function onClick(event, item) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', item)
  }
</script>

<!-- accessible autocomplete, based on https://haltersweb.github.io/Accessibility/autocomplete.html -->
<ul id="compose-autosuggest-list-{realm}" class="compose-autosuggest-list" role="listbox">
  {#each items as item, i (item.shortcodes ? `emoji-${item.unicode || item.name}` : item.id ? `spark-${item.id}` : `hashtag-${item.name}`)}
    <li
      id="compose-autosuggest-active-item-{realm}-{i}"
      class="compose-autosuggest-list-item {i === selected ? 'selected' : ''}"
      role="option"
      aria-selected={i === selected}
      on:click={(event) => onClick(event, item)}
    >
      <!-- aria-label would be simpler than an sr-only element, but that breaks VoiceOver+Safari -->
      <span class="sr-only">{ariaLabels[i]}</span>
      <div class="compose-autosuggest-list-grid" aria-hidden="true">
        {#if type === 'spark'}
          <div class="compose-autosuggest-list-item-avatar">
            <Avatar size={$isVeryTinyMobileSize ? 'extra-small' : 'small'} entity={item} />
          </div>
          <span class="compose-autosuggest-list-display-name">
            <SparkDisplayName spark={item} />
          </span>
          {#if item.handle}
            <span class="compose-autosuggest-list-username">
              {'@' + item.handle}
            </span>
          {/if}
        {:else if type === 'hashtag'}
          <SvgIcon href="#fa-hashtag" ariaHidden={true} className="compose-autosuggest-list-item-icon" />
          <span class="compose-autosuggest-list-display-name compose-autosuggest-list-display-name-single">
            {item.name}
          </span>
        {:else}
          <!-- emoji -->
          {#if item.url}
            <!-- custom emoji -->
            <img src={item.url} class="compose-autosuggest-list-item-icon" alt="" aria-hidden="true" />
          {:else}
            <!-- native emoji -->
            <span class="compose-autosuggest-list-item-icon compose-autosuggest-list-item-native-emoji">
              {item.unicode}
            </span>
          {/if}
          <span class="compose-autosuggest-list-display-name compose-autosuggest-list-display-name-single">
            {item.shortcodes.map((_) => `:${_}:`).join(' ')}
          </span>
        {/if}
      </div>
    </li>
  {/each}
</ul>

<style>
  .compose-autosuggest-list {
    list-style: none;
    width: 100%;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid var(--compose-autosuggest-outline);
  }
  .compose-autosuggest-list-item {
    border-bottom: 1px solid var(--compose-autosuggest-outline);
    display: flex;
    padding: 10px;
    background: var(--settings-list-item-bg);
    margin: 0;
    flex: 1;
    cursor: pointer;
  }
  .compose-autosuggest-list-item:last-child {
    border-bottom: none;
  }
  .compose-autosuggest-list-grid {
    display: grid;
    width: 100%;
    grid-template-areas:
      'icon     display-name'
      'icon     username';
    grid-template-columns: min-content 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
  }
  :global(.compose-autosuggest-list-item-avatar) {
    grid-area: icon;
  }
  :global(.compose-autosuggest-list-item-icon) {
    grid-area: icon;
    width: 48px;
    height: 48px;
    object-fit: contain;
    fill: var(--deemphasized-text-color);
  }
  .compose-autosuggest-list-item-native-emoji {
    font-family: SequelEmoji;
    font-size: 32px;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .compose-autosuggest-list-display-name {
    grid-area: display-name;
    font-size: 1.1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    text-align: left;
  }
  .compose-autosuggest-list-display-name-single {
    grid-row: 1 / 3;
    align-self: center;
  }
  .compose-autosuggest-list-username {
    grid-area: username;
    font-size: 1em;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .compose-autosuggest-list-item:hover,
  .compose-autosuggest-list-item.selected {
    background: var(--compose-autosuggest-item-hover);
  }
  .compose-autosuggest-list-item:active {
    background: var(--compose-autosuggest-item-active);
  }

  @media (max-width: 320px) {
    .compose-autosuggest-list-item {
      padding: 5px;
    }
    .compose-autosuggest-list-grid {
      grid-column-gap: 5px;
    }
    :global(.compose-autosuggest-list-item-icon) {
      width: 24px;
      height: 24px;
    }
    .compose-autosuggest-list-item-native-emoji {
      font-size: 18px;
    }
  }
</style>
