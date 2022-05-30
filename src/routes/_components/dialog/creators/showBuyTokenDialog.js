import BuyTokenDialog from '../components/BuyTokenDialog.svelte'
import { showDialog } from './showDialog'

export default function showBuyTokenDialog (listing, onSuccess, onCancel, onError, label) {
  return showDialog(BuyTokenDialog, {
    listing,
    label
  }, {
    success: onSuccess,
    cancel: onCancel,
    error: onError
  })
}
