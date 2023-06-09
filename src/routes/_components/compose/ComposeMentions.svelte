<script>
  import { get } from '../../_utils/lodash-lite'
  import { currentComposeRealm } from '../../_store/autosuggest'
  import { composeData, currentInstance, setComposeData } from '../../_store/local'
  import StickerList from '../StickerList.svelte'

  export let realm

  $: mentions = get($composeData, [$currentInstance, realm, 'mentions'], [])

  const removeMention = (event) => {
    const { name } = event.detail
    const index = mentions.findIndex((mention) => mention.name === name)
    mentions.splice(index, 1)
    setComposeData($currentComposeRealm, { mentions })
  }
</script>

<div class="mentions">
  <StickerList {mentions} on:itemclick={removeMention} />
</div>

<style>
  .mentions {
    grid-area: mentions;
  }
</style>
