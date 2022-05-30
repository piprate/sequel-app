import ComposeDialog from '../components/ComposeDialog.svelte'
import { showDialog } from './showDialog'

export default function showComposeDialog () {
  return showDialog(ComposeDialog, { label: 'intl.composeStatus' })
}
