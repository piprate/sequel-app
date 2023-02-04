<script>
    import { createEventDispatcher } from "svelte";
    import { unwrap } from "../_utils/mapper";
    import Sticker from "./Sticker.svelte"

    export let mentions
    export let actionType = 'button'

    const dispatch = createEventDispatcher()
    
    const mapTypeToIcon = {
      bubble: '#fa-map-marker',
      world: '#fa-globe',
      spark: '#fa-user'
    }

    const onItemClick = (event) => {
        dispatch('itemclick', event)
    }
</script>
    

<div class="stickers">
    {#each mentions as {id, name, entityType}}
        <Sticker
            name={name}
            href={actionType === 'link' ? `/${entityType.toLowerCase()}s/${unwrap(id)}` : undefined}
            iconHref={mapTypeToIcon[entityType?.toLowerCase()]}
            on:click={onItemClick}
        >
            {name}
        </Sticker>
    {/each}
</div>

<style>
    .stickers {
        display: flex;
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        flex-wrap: wrap;
        padding-left: 4px;
        margin-bottom: 1rem;
    }
</style>