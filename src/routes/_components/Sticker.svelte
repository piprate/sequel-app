<script>
    import { createEventDispatcher } from 'svelte'
    import SvgIcon from './SvgIcon.svelte';

    export let name
    export let href = undefined
    export let iconHref = undefined

    const dispatch = createEventDispatcher()

    const removeMention = (event) => {
      dispatch('click', {
        name: event.currentTarget.dataset.name
      })
    }
</script>

<svelte:element this={href ? 'a' : 'button'} href={href} data-name={name} class="sticker" on:click={removeMention}>
    {#if iconHref}
        <SvgIcon className="icon-button-svg small-icon" href={iconHref} />
    {/if}
    <span class="sticker-label">
        <slot></slot>
    </span>
</svelte:element>

<style>
    .sticker {
        background-color: rgba(129, 129, 129, 0.2);
        border-radius: 4px;
        padding: 3px 5px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border: none;
        transition: background-color ease-out 100ms;
    }

    button.sticker {
        padding: 5px;
    }

    a.sticker {
        text-decoration: none;
    }
    
    .sticker:hover, .sticker:focus {
        background-color: rgba(129, 129, 129, 0.5);
    }

    :global(.sticker .icon-button-svg) {
        fill: var(--deemphasized-text-color);
    }
    
    :global(.sticker .small-icon) {
        width: 16px;
        height: 16px;
    }

    .sticker-label {
        font-size: 15px;
        color: var(--deemphasized-text-color);
    }

</style>