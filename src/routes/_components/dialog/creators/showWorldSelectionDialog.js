import WorldSelectionDialog from '../components/WorldSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showWorldSelectionDialog (selectedWorld, onSelect, label, title) {
  return showDialog(WorldSelectionDialog, {
    selectedWorld,
    label,
    title
  }, {
    select: onSelect
  })
}
