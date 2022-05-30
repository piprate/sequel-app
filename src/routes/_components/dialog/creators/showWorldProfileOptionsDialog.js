import WorldProfileOptionsDialog from '../components/WorldProfileOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showSparkProfileOptionsDialog (world, relationship, ourSpark) {
  return showDialog(WorldProfileOptionsDialog, {
    label: 'intl.worldProfileOptions',
    title: '',
    world: world,
    relationship: relationship,
    ourSpark: ourSpark
  })
}
