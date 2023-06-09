import ReportDialog from '../components/ReportDialog.svelte'
import { showDialog } from './showDialog'
import { formatIntl } from '../../../_utils/formatIntl'

export default function showReportDialog({ post, spark }) {
  const label = formatIntl('intl.reportSpark', { spark: spark?.name || post?.authorRef.name })
  return showDialog(ReportDialog, {
    label,
    title: label,
    post,
    spark: spark || post?.authorRef
  })
}
