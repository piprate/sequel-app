<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { goto } from '$app/navigation'
  import { unwrap } from '../../../_utils/mapper';
  import { onMount } from 'svelte';
  import { updateProfileAndRelationship } from '../../../_actions/sparks';
  import { observedRelationship } from '../../../_store/local';

  export let id
  export let label
  export let title
  export let digitalArt
  export let ourSpark

  const gotoDelay = 100

  onMount(async () => {
      await updateProfileAndRelationship(unwrap(ourSpark.id))
    })

  $: isTokenCreator = $observedRelationship?.tokenCreator

  $: digitalArtId = digitalArt && digitalArt.id
  $: isOwner = digitalArt.artist === ourSpark.id  // refer to relationship to suppress warnings
  $: items = [
    isTokenCreator && isOwner && !digitalArt.sealRecord && {
      key: 'edit',
      label: 'intl.editDigitalArt',
      icon: '#fa-edit'
    }
  ].filter(Boolean)

  function onEdit () {
    close(id)
    setTimeout(() => {
      goto(`/studio/digital-art/${unwrap(digitalArtId)}/edit`)
    }, gotoDelay)
  }
</script>

<ModalDialog
  {id}
  {label}
  {title}
  shrinkWidthToFit={true}
  background="var(--main-bg)"
>
  {#if items.length}
    <GenericDialogList selectable={false} {items} on:click="{onEdit}"/>
  {:else}
    <div class="no-options">
      {intl.menuUnavailable}
    </div>
  {/if}
</ModalDialog>

<style>
  .no-options {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
    text-align: center;
    margin: 20px;
  }
</style>