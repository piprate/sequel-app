import { importShowReportDialog } from '../_components/dialog/asyncDialogs/importShowReportDialog.js'

export async function reportPostOrSpark ({ post, spark }) {
  const showReportDialog = await importShowReportDialog()
  showReportDialog({ post, spark })
}
