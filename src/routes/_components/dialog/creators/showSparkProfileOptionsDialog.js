import SparkProfileOptionsDialog from '../components/SparkProfileOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showSparkProfileOptionsDialog (spark, relationship, ourSpark) {
  return showDialog(SparkProfileOptionsDialog, {
    label: 'intl.profileOptions',
    title: '',
    spark: spark,
    relationship: relationship,
    ourSpark: ourSpark
  })
}
