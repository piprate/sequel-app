import NFTSelectionDialog from '../components/NFTSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showNFTSelectionDialog (selectedNFT, onSelect, label) {
  return showDialog(NFTSelectionDialog, {
    selectedNFT,
    label
  }, {
    select: onSelect
  })
}
