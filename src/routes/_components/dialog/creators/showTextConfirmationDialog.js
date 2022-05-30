import TextConfirmationDialog from '../components/TextConfirmationDialog.svelte'
import { showDialog } from './showDialog'

export default function showTextConfirmationDialog (options) {
  return showDialog(TextConfirmationDialog, Object.assign({
    label: 'intl.confirm'
  }, options))
}
