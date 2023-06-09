import CancelDialog from '../components/CancelDialog.svelte'
import { showDialog } from './showDialog'

export default function showCancelDialog(releaseId, parentDialogId) {
  return showDialog(CancelDialog, { label: 'intl.cancel', releaseId, parentDialogId })
}
