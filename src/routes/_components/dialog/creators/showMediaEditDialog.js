import MediaEditDialog from '../components/MediaEditDialog.svelte'
import { showDialog } from './showDialog'

export default function showMediaEditDialog (realm, field, index, type) {
  return showDialog(MediaEditDialog, {
    label: 'intl.editMedia',
    title: 'intl.editMedia',
    realm,
    field,
    index,
    type
  })
}
