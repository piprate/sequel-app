<script>
  import { paymentRoleName } from '../../_utils/evergreen'

  export let listing
  export let numEditions = 1

  $: payments = listing.payments || []
  $: profile = listing.object && listing.object.evergreenProfile
  $: paymentsForDisplay = (payments.map(payment => ({
    role: paymentRoleName(payment.role, profile),
    receiver: `0x${payment.receiver}`,
    rate: (payment.rate * 100.0).toFixed(2) + '%',
    amount: `${(payment.amount * numEditions).toFixed(2)} ${payment.currency}`
  })))
</script>

<div class="payments">
  {#if paymentsForDisplay.length}
    <div class="evergreen-profile-header">
      <h2>{intl.payments}</h2>
    </div>
    <div class="payments-border"></div>
    {#each paymentsForDisplay as payment, i}
      <div
              id="payments-participant-{i}"
              class="payments-cell payments-participant-name"
              role="term"
      >
        <div class="role-name">{payment.role}</div>
        <div class="role-address">{payment.receiver}</div>
      </div>
      <div
              class="payments-cell payments-value payments-amount"
              role="definition"
              aria-labelledby="payments-participant-{i}"
      >
        {payment.rate}
      </div>
      <div
              class="payments-cell payments-value payments-amount"
              role="definition"
              aria-labelledby="payments-participant-{i}"
      >
        {payment.amount}
      </div>
    {/each}
    <div class="payments-border"></div>
  {/if}
</div>
<style>
  .payments {
    grid-area: payments;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-row-gap: 5px;
    padding: 20px 0;
  }

  .evergreen-profile-header {
    grid-column: 1 / 4;
  }

  .payments-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 4;
    background: var(--main-border);
    justify-self: center;
  }

  .payments-cell {
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
  }

  .payments-participant-name {
    padding: 0 20px 5px 0;
    position: relative;
    max-width: 300px;
  }

  .payments-participant-name:after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    border-right: 1px solid var(--main-border);
  }

  .role-name {
    text-transform: uppercase;
  }

  .role-address {
    color: var(--deemphasized-text-color);
  }

  .payments-value {
    padding: 0 10px 10px 20px;
  }

  .payments-amount {
    text-align: right;
  }

  :global(.underline-links .payments a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .payments {
      padding: 5px 0;
    }
    .payments-cell {
      font-size: 0.8em;
    }
    .payments-participant-name {
      padding: 0 10px 5px 0;
      max-width: 40vw;
    }
    .payments-value {
      padding: 0 10px 5px 10px;
    }
  }
</style>