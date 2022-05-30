import PostPrivacyDialog from '../components/PostPrivacyDialog.svelte'
import { showDialog } from './showDialog'

export default function showPostPrivacyDialog (realm) {
  return showDialog(PostPrivacyDialog, {
    label: 'intl.postPrivacy',
    title: 'intl.postPrivacy',
    realm: realm
  })
}
