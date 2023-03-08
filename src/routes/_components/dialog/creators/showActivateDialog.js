import ActivateDialog from '../components/ActivateDialog.svelte'
import { showDialog } from './showDialog'

export default function showActivateDialog (releaseId, parentDialogId) {
  return showDialog(ActivateDialog, { label: 'intl.activate', releaseId, parentDialogId })
}
