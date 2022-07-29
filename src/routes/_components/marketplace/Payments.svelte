<script>
  export let listing
  export let numEditions = 1

  function roleName (role) {
    if (role === 'ClimateAction') {
      return 'Climate Action'
    } else {
      return role
    }
  }

  $: payments = listing.payments || []
  $: paymentsForDisplay = (payments.map(payment => ({
    role: roleName(payment.role),
    receiver: `0x${payment.receiver}`,
    rate: (payment.rate * 100.0).toFixed(2) + '%',
    amount: `${(payment.amount * numEditions).toFixed(2)} ${payment.currency}`
  })))
</script>

{#if paymentsForDisplay.length}
  <div class="payments">
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
        {payment.role}
      </div>
      <div
              class="payments-cell payments-value"
              role="definition"
              aria-labelledby="payments-participant-{i}"
      >
        {payment.receiver}
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
  </div>
{/if}
<style>
  .payments {
    grid-area: evergreen;
    display: grid;
    grid-template-columns: auto max-content 1fr 1fr;
    grid-row-gap: 5px;
    align-items: center;
    padding: 20px 0;
  }

  .evergreen-profile-header {
    grid-column: 1 / 5;
  }

  .payments-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 5;
    background: var(--main-border);
    justify-self: center;
  }

  .payments-cell {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    font-size: 1.1em;
  }

  .payments-participant-name {
    padding: 10px 20px 10px 0;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
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

  .payments-value {
    padding: 10px 10px 10px 20px;
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
      padding: 5px 10px 5px 0;
      max-width: 40vw;
    }
    .payments-value {
      padding: 5px 10px 5px 10px;
    }
  }
</style>