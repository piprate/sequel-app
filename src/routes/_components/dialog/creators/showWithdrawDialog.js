import WithdrawDialog from '../components/WithdrawDialog.svelte'
import { showDialog } from './showDialog'

export default function showWithdrawDialog (listingId, parentDialogId) {
  return showDialog(WithdrawDialog, {
    label: 'intl.confirm',
    listingId,
    parentDialogId
  })
}
