import MuteDialog from '../components/MuteDialog.svelte'
import { showDialog } from './showDialog'

export default function showMuteDialog (account) {
  return showDialog(MuteDialog, {
    label: 'intl.mute',
    account
  })
}
