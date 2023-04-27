import RecoverPasswordDialog from '../components/RecoverPasswordDialog.svelte'
import { showDialog } from './showDialog'

export default function showRecoverPasswordDialog (email) {
  return showDialog(RecoverPasswordDialog, {
    email
  })
}
