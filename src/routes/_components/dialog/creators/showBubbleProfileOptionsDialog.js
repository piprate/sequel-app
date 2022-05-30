import BubbleProfileOptionsDialog from '../components/BubbleProfileOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showSparkProfileOptionsDialog (bubble, relationship, ourSpark) {
  return showDialog(BubbleProfileOptionsDialog, {
    label: 'intl.bubbleProfileOptions',
    title: '',
    bubble: bubble,
    relationship: relationship,
    ourSpark: ourSpark
  })
}
