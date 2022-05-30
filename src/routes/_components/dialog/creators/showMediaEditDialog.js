import MediaEditDialog from '../components/MediaEditDialog.svelte'
import { showDialog } from './showDialog'

export default function showMediaEditDialog (realm, index, type) {
  return showDialog(MediaEditDialog, {
    label: 'intl.editMedia',
    title: 'intl.editMedia',
    realm,
    index,
    type
  })
}
