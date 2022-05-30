<script>
  import ModalDialog from './ModalDialog.svelte'
  import { currentComposeData } from '../../../_store/instance';
  import { commentPrivacyOptions, POST_PRIVACY_OPTIONS, POST_PRIVACY_OPTIONS_PRIVATE } from '../../../_static/posts'
  import { setPostPrivacy } from '../../../_actions/postPrivacy'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { observedBubbleRelationship } from "../../../_store/local";

  export let id;
  export let label;
  export let title;
  export let realm;

  $: composeData = $currentComposeData[realm] || {};
  $: isComment = !!composeData.inReplyToId
  $: defaultVisibility = ($observedBubbleRelationship && $observedBubbleRelationship.defaultVisibility) || 'private';
  $: originalPostPrivacyKey = composeData.originalPostPrivacy || defaultVisibility;
  $: postPrivacyKey = composeData.postPrivacy || defaultVisibility;
  $: postPrivacy = POST_PRIVACY_OPTIONS.find(_ => _.key === postPrivacyKey);
  $: postPrivacyOptions = isComment ?
          commentPrivacyOptions(originalPostPrivacyKey) :
          defaultVisibility === 'private' ?
                  POST_PRIVACY_OPTIONS_PRIVATE:
                  POST_PRIVACY_OPTIONS;
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