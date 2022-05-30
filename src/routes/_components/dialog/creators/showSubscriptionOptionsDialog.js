import SubscriptionOptionsDialog from '../components/SubscriptionOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showSubscriptionOptionsDialog (creatorId, selectedPlan, onSelect, label, title) {
  return showDialog(SubscriptionOptionsDialog, {
    creatorId,
    selectedPlan,
    label,
    title
  }, {
    select: onSelect
  })
}
