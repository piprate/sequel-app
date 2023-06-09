import PostInputFormatDialog from '../components/PostInputFormatDialog.svelte'
import { showDialog } from './showDialog'

export default function showPostInputFormatDialog(realm) {
  return showDialog(PostInputFormatDialog, {
    label: 'intl.postInputFormat',
    title: 'intl.postInputFormat',
    realm: realm
  })
}
