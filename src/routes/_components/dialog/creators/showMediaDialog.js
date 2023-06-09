import MediaDialog from '../components/MediaDialog.svelte'
import { showDialog } from './showDialog'

export default function showMediaDialog(mediaItems, scrolledItem) {
  return showDialog(MediaDialog, {
    label: 'intl.media',
    mediaItems,
    scrolledItem
  })
}
