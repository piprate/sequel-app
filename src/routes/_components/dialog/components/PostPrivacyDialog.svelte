<script>
  import ModalDialog from './ModalDialog.svelte'
  import { currentComposeData } from '../../../_store/instance'
  import { commentPrivacyOptions, POST_PRIVACY_OPTIONS, postPrivacyOptions } from '../../../_static/posts'
  import { setPostPrivacy } from '../../../_actions/postPrivacy'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { observedBubble, observedBubbleRelationship } from '../../../_store/local'
  import { onMount } from 'svelte'

  export let id
  export let label
  export let title
  export let realm

  $: composeData = $currentComposeData[realm] || {}
  $: isComment = !!composeData.inReplyToId
  $: federationMode = $observedBubble?.federationMode || 'disabled'
  $: defaultVisibility = $observedBubbleRelationship?.defaultVisibility || 'private'
  $: defaultPostPrivacy = federationMode === 'continuous_mirror' ? 'fediverse' : defaultVisibility
  $: originalPostPrivacyKey = composeData.originalPostPrivacy || defaultPostPrivacy
  $: postPrivacyKey = composeData.postPrivacy || defaultPostPrivacy
  $: postPrivacy = POST_PRIVACY_OPTIONS.find((_) => _.key === postPrivacyKey)
  $: postPrivacyOptionsList = isComment
    ? commentPrivacyOptions(originalPostPrivacyKey)
    : postPrivacyOptions(defaultVisibility, federationMode)
  $: items = (() => {
    return postPrivacyOptionsList.map((option) => ({
      key: option.key,
      label: option.label,
      icon: option.icon,
      selected: postPrivacy.key === option.key
    }))
  })()

  function onClick(event) {
    setPostPrivacy(realm, event.detail.key)
    close(id)
  }

  onMount(() => {
    console.log('defaultPostPrivacy = ', defaultPostPrivacy)
    console.log('postPrivacyKey = ', postPrivacyKey)
  })
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={true} background="var(--main-bg)">
  <GenericDialogList selectable={true} {items} on:click={onClick} />
</ModalDialog>
