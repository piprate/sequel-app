import ComposeDialog from '../components/ComposeDialog.svelte'
import { showDialog } from './showDialog'

export default function showComposeDialog (bubbleId) {
  return showDialog(ComposeDialog, { label: 'intl.composePost', bubbleId })
}
