<script>
  import ModalDialog from './ModalDialog.svelte'
  import { currentComposeData, currentVerifyCredentials } from '../../../_store/instance'
  import { POST_PRIVACY_OPTIONS } from '../../../_static/statuses'
  import { setPostPrivacy } from '../../../_actions/postPrivacy'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'

  export let id;
  export let label;
  export let title;
  export let realm;

  let postPrivacyOptions = POST_PRIVACY_OPTIONS;

  $: composeData = $currentComposeData[realm] || {};
  $: postPrivacy = (() => {
    return POST_PRIVACY_OPTIONS.find(_ => _.key === postPrivacyKey)
  })();
  $: postPrivacyKey = (() => {
    return composeData.postPrivacy || $currentVerifyCredentials.source.privacy
  })();
  $: items = (() => {
    return postPrivacyOptions.map(option => ({
      key: option.key,
      label: option.label,
      icon: option.icon,
      selected: postPrivacy.key === option.key
    }))
  })();

  function onClick(event) {
    setPostPrivacy(realm, event.detail.key);
    close(id);
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
>
  <GenericDialogList selectable={true} {items} on:click="{onClick}" />
</ModalDialog>