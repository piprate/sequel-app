import AnnounceDialog from '../components/AnnounceDialog.svelte'
import { showDialog } from './showDialog'

export default function showAnnounceDialog(releaseId, parentDialogId) {
  return showDialog(AnnounceDialog, { label: 'intl.announce', releaseId, parentDialogId })
}
