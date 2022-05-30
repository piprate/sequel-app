<script>
  import ModalDialog from './ModalDialog.svelte'
  import LoadingPage from '../../LoadingPage.svelte'
  import SvgIcon from '../../SvgIcon.svelte'
  import RadioGroup from '../../radio/RadioGroup.svelte'
  import RadioGroupButton from '../../radio/RadioGroupButton.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher, onMount } from 'svelte'
  import { currentInstance } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { toast } from '../../toast/toast'
  import { getSubscriptionProposal } from '../../../_api/subscription'
  import { getPlanName } from '../../../_actions/spark/subscribe'

  export let id
  export let label
  export let title
  export let creatorId
  export let selectedPlan

  const dispatch = createEventDispatcher()

  let loading = true
  let plans = []

  function onClick (plan) {
    if (plan.id === '') {
      dispatch('select', null)
    } else {
      dispatch('select', plan.data)
    }
    close(id)
  }

  function getPlanCostLabel (plan) {
    switch (plan.type) {
      case 'CommunityPlan':
        return 'intl.communityPlanCost'
      case 'StandardPlan':
        return formatIntl('intl.standardPlanCost', {
          fee: plan.fee,
          currency: plan.feeCurrency,
          duration: plan.duration
        })
      default:
        return ''
    }
  }

  $: planStates = plans.map((plan, index) => ({
    id: plan.id,
    index,
    name: getPlanName(plan.type),
    costLabel: getPlanCostLabel(plan),
    selected: (selectedPlan === plan.id),
    label: formatIntl('intl.selectedPlanLabel', { plan: getPlanName(plan.type), selected: (selectedPlan === plan.id) }),
    switchLabel: plan.id ? formatIntl('intl.switchToNameOfPlan', { plan: getPlanName(plan.type) }) : 'intl.subscribeLater',
    data: plan
  }))

  onMount(async () => {
    try {
      const proposal = await getSubscriptionProposal($currentInstance, $accessToken, creatorId)
      plans = proposal.plans.concat([
        {
          id: '', // entry for 'Subscribe later' option
        }
      ])
    } catch (e) {
      /* no await */
      toast.say(formatIntl('intl.error', { error: (e.message || '') }))
    } finally {
      loading = false
    }
  })
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
>
  {#if loading}
    <LoadingPage />
  {:else}
    {#if plans && plans.length}
      <RadioGroup id="plan-selector" className="plan-selection-radio" label="{intl.selectPlanFromList}" length={plans.length}>
        <ul class="plans-results" aria-label="{intl.planList}">
          {#each planStates as plan}
            <li class="subscription-options">
              <RadioGroupButton
                      id="plan-selector={plan.id}"
                      className="plan-selector-button"
                      label={plan.switchLabel}
                      checked={plan.selected}
                      index={plan.index}
                      on:click="{ (e) => onClick(plan) }">
                <div class="plan-details">
                  {#if plan.id}
                  <div class="plan-name">
                    {plan.name}
                  </div>
                  <div class="plan-cost">
                    {plan.costLabel}
                  </div>
                  {:else}
                    <div class="subscribe-later">{intl.subscribeLater}</div>
                  {/if}
                  <div class="plan-selector-button-wrapper">
                    <SvgIcon className="plan-selector-button-svg {plan.selected ? '' : 'hidden'}"
                             href="#fa-check" />
                  </div>
                </div>
              </RadioGroupButton>
            </li>
          {/each}
        </ul>
      </RadioGroup>
    {:else}
     no plans found
    {/if}
  {/if}
</ModalDialog>

<style>
  .subscription-options {
    box-sizing: border-box;
    border-bottom: 1px solid var(--main-border);
    display: flex;
    min-height: 74px;
    background: var(--settings-list-item-bg);
  }
  .subscription-options:last-child {
    border-bottom: none;
  }
  .subscription-options:hover {
    background: var(--settings-list-item-bg-hover);
  }
  :global(.plan-selection-radio) {
    width: 100%;
  }
  .plans-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  .plan-selector-button-wrapper {
    position: relative;
    grid-area: button;
  }
  :global(.plan-selector-button) {
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    border: none;
    background: none;
    align-items: center;
    justify-content: center;
    margin: 1px;
  }
  :global(.plan-selector-button-svg) {
    width: 32px;
    height: 32px;
    display: inline-block;
    fill: var(--svg-fill);
  }
  .plan-details {
    flex: 1;
    display: grid;
    grid-template-areas:
      "name  button"
      "cost  button";
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    text-align: left;
    font-size: 14px;
  }
  .plan-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .plan-cost {
    grid-area: cost;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--deemphasized-text-color);
  }
  .subscribe-later {
    color: var(--deemphasized-text-color);
    grid-area: name;
    font-size: 1.2em;
  }
  @media (max-width: 767px) {
    .plan-details {
      grid-column-gap: 10px;
    }
  }
</style>