import MuteDialog from '../components/MuteDialog.svelte'
import { showDialog } from './showDialog'

export default function showMuteDialog(spark) {
  return showDialog(MuteDialog, {
    label: 'intl.mute',
    spark
  })
}
