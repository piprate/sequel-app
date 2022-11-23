<script>
    import ModalDialog from './ModalDialog.svelte'
    import GenericDialogList from './GenericDialogList.svelte'
    import { currentComposeData } from '../../../_store/instance'
    import { setPostInputFormat } from '../../../_actions/setPostInputFormat'
    import { close } from '../helpers/closeDialog'
    import { POST_INPUT_FORMATS } from '../../../_static/posts';

    export let id
    export let label
    export let title
    export let realm

    $: composeData = $currentComposeData[realm] || {}
    $: defaultPostInputFormat = "txt"
    $: postInputFormatKey = composeData.postInputFormat || defaultPostInputFormat

    $: items = POST_INPUT_FORMATS.map(option => ({
        key: option.key,
        label: option.label,
        selected: postInputFormatKey === option.key
    }))

    function onClick(event) {
        setPostInputFormat(realm, event.detail.key)
        close(id)
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