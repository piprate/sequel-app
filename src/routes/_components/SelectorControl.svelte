<script>
    import { createEventDispatcher } from "svelte";

    export let label
    export let itemName = ''
    export let buttonLabel

    const dispatch = createEventDispatcher()

    const onClick = (event) => {
        dispatch('click', event)
    }
</script>

<label for="item">{label}</label>
<div class="item-selector">
    {#if itemName}
        <div class="item-name">{itemName}</div>
    {/if}
    <button id="item" type="button" on:click={onClick}>{buttonLabel}</button>
</div>

<style>
    label {
        margin-bottom: 0.25rem;
    }

    .item-selector {
        display: flex;
        align-items: center;
    }

    .item-selector #item {
        margin: 0 0;
    }

    .item-name {
        font-size: 1.2em;
        padding-left: 5px;
        padding-right: 10px;
    }
</style>