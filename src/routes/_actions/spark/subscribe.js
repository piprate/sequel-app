import { confirmSubscription, requestSubscription, unsubscribeFromSpark } from '../../_api/subscription'
import { toast } from '../../_components/toast/toast'
import { updateLocalRelationship } from '../sparks'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { importShowSubscriptionOptionsDialog } from '../../_components/dialog/asyncDialogs/importShowSubscriptionOptionsDialog'

const planNames = {
  'CommunityPlan': 'intl.communityPlanName',
  'StandardPlan': 'intl.standardPlanName'
}

export function getPlanName (planType) {
  return planNames[planType] || 'intl.unknownPlanName'
}

export async function setSparkSubscribed (sparkId, subscribe, currentPlan, asSpark, toastOnSuccess, resultCertainCallback) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  if (subscribe) {
    const showDialog = await importShowSubscriptionOptionsDialog()
    showDialog(sparkId, currentPlan, async function (event) {
      const plan = event.detail
      if (!plan) {
        // no plan was selected
        return
      }
      try {
        const offer = await requestSubscription(_currentInstance, _accessToken, sparkId, plan.id, asSpark)
        if (resultCertainCallback) {
          resultCertainCallback(true)
        }
        const relationship = await confirmSubscription(_currentInstance, _accessToken, sparkId, offer, null, asSpark)
        await updateLocalRelationship(_currentInstance, sparkId, relationship)
        if (toastOnSuccess) {
          /* no await */
          toast.say('intl.subbedSpark')
        }
      } catch (e) {
        resultCertainCallback(false)
        console.error(e)
        /* no await */
        toast.say(formatIntl('intl.unableToSubscribe', { error: (e.message || '') }))
      }
    }, '', 'intl.chooseSubscriptionPlan')
  } else {
    if (resultCertainCallback) {
      resultCertainCallback(false)
    }
    try {
      const relationship = await unsubscribeFromSpark(_currentInstance, _accessToken, sparkId, asSpark)
      await updateLocalRelationship(_currentInstance, sparkId, relationship)
      if (toastOnSuccess) {
        /* no await */
        toast.say('intl.unsubbedSpark')
      }
    } catch (e) {
      resultCertainCallback(true)
      console.error(e)
      /* no await */
      toast.say(formatIntl('intl.unableToUnsubscribe', { error: (e.message || '') }))
    }
  }
}
