import OptionSelectionDialog from '../components/OptionSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showOptionSelectionDialog(items, onSelect, label, title) {
  return showDialog(
    OptionSelectionDialog,
    {
      label,
      title,
      items
    },
    {
      select: onSelect
    }
  )
}
