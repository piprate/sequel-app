<script>
  import SvgIcon from '../../SvgIcon.svelte'
  import { createEventDispatcher } from 'svelte'

  export let selectable
  export let items

  const dispatch = createEventDispatcher()
</script>

<ul class="generic-dialog-list">
  {#each items as item (item.key)}
    <li class="generic-dialog-list-item">
      <button class="generic-dialog-list-button focus-fix" on:click={() => dispatch('click', item)}>
        <!-- Extra wrapper inside button is required for KaiOS. Seems old Firefox does not like flex buttons. -->
        <div class="generic-dialog-list-button-inner">
          <SvgIcon className="generic-dialog-list-item-svg" href={item.icon} />
          <span class="generic-dialog-list-button-span">
            {item.label}
          </span>
          {#if selectable}
            <SvgIcon className="generic-dialog-list-item-svg {item.selected ? '' : 'hidden'}" href="#fa-check" />
          {/if}
        </div>
      </button>
    </li>
  {/each}
</ul>

<style>
  .generic-dialog-list {
    list-style: none;
    width: 100%;
    border: 1px solid var(--settings-list-item-border);
    box-sizing: border-box;
  }
  .generic-dialog-list-item {
    border: 1px solid var(--settings-list-item-border);
    font-size: 1.2em;
    display: flex;
    outline-width: 4px;
  }
  :global(.generic-dialog-list-item-svg) {
    width: 24px;
    height: 24px;
    fill: var(--svg-fill);
  }
  .generic-dialog-list-button {
    flex: 1;
    padding: 20px;
    background: var(--settings-list-item-bg);
    border: none;
    margin: 0;
    overflow-x: hidden;
  }
  .generic-dialog-list-button-inner {
    display: flex;
    flex-direction: row;
  }
  .generic-dialog-list-button-span {
    flex: 1;
    margin-left: 20px;
    margin-right: 10px;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .generic-dialog-list-button:hover {
    background: var(--settings-list-item-bg-hover);
  }
  .generic-dialog-list-button:active {
    background: var(--settings-list-item-bg-active);
  }

  @media (max-width: 767px) {
    .generic-dialog-list-button {
      padding: 20px 10px;
    }
    .generic-dialog-list-button-span {
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  @media (max-width: 479px) {
    .generic-dialog-list {
      min-width: calc(100% - 20px);
    }
    .generic-dialog-list-button {
      padding: 15px 10px;
    }
    .generic-dialog-list-button-span {
      margin-left: 10px;
    }
  }

  @media (max-width: 320px) {
    .generic-dialog-list {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .generic-dialog-list-button {
      padding: 10px 10px;
    }
  }
</style>
