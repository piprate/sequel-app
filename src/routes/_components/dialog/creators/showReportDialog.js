import ReportDialog from '../components/ReportDialog.svelte'
import { showDialog } from './showDialog'
import { formatIntl } from '../../../_utils/formatIntl'

export default function showReportDialog ({ spark, post }) {
  const label = formatIntl('intl.reportSpark', { spark: `@${spark.id}` })
  return showDialog(ReportDialog, {
    label,
    title: label,
    spark,
    post
  })
}
