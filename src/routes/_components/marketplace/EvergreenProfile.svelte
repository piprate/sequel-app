<script>
  import { roleName } from '../../_utils/evergreen'

  export let profile;

  $: roles = profile.roles || [];
  $: rolesForDisplay = (roles.map(role => ({
    role: roleName(role.id),
    receiver: `0x${role.addr}`,
    primaryRate: (role.initialSaleCommission * 100.0).toFixed(2)+"%",
    secondaryRate: (role.secondaryMarketCommission * 100.0).toFixed(2)+"%",
  })));
</script>

{#if rolesForDisplay.length}
  <div class="evergreen-profile-meta">
    <div class="evergreen-profile-header">
      <h2>{intl.evergreenProfile}</h2>
    </div>
    <div
            id="evergreen-profile-meta-name-head"
            class="evergreen-profile-meta-cell evergreen-profile-meta-name"
            role="term"
    >
      {intl.evergreenHeaderRole}
    </div>
    <div
            class="evergreen-profile-meta-cell evergreen-profile-meta-header"
            role="definition"
            aria-labelledby="evergreen-profile-meta-name-head"
    >
      {intl.evergreenHeaderAddress}
    </div>
    <div
            class="evergreen-profile-meta-cell evergreen-profile-meta-header header-amount"
            role="definition"
            aria-labelledby="evergreen-profile-meta-name-head"
    >
      {intl.evergreenHeaderPrimary}
    </div>
    <div
            class="evergreen-profile-meta-cell evergreen-profile-meta-header header-amount"
            role="definition"
            aria-labelledby="evergreen-profile-meta-name-head"
    >
      {intl.evergreenHeaderSecondary}
    </div>
    <div class="evergreen-profile-meta-border"></div>
    {#each rolesForDisplay as role, i}
      <div
              id="evergreen-profile-meta-name-{i}"
              class="evergreen-profile-meta-cell evergreen-profile-meta-name"
              role="term"
      >
        {role.role}
      </div>
      <div
              class="evergreen-profile-meta-cell evergreen-profile-meta-value"
              role="definition"
              aria-labelledby="evergreen-profile-meta-name-{i}"
      >
        {role.receiver}
      </div>
      <div
              class="evergreen-profile-meta-cell evergreen-profile-meta-value evergreen-profile-meta-amount"
              role="definition"
              aria-labelledby="evergreen-profile-meta-name-{i}"
      >
        {role.primaryRate}
      </div>
      <div
              class="evergreen-profile-meta-cell evergreen-profile-meta-value evergreen-profile-meta-amount"
              role="definition"
              aria-labelledby="evergreen-profile-meta-name-{i}"
      >
        {role.secondaryRate}
      </div>
    {/each}
    <div class="evergreen-profile-meta-border"></div>
  </div>
{/if}
<style>
  .evergreen-profile-meta {
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

  .evergreen-profile-header h2 {
    font-size: 1.5em;
  }

  .evergreen-profile-meta-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 5;
    background: var(--main-border);
    justify-self: center;
  }

  .evergreen-profile-meta-cell {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    font-size: 1.1em;
  }

  .evergreen-profile-meta-name {
    padding: 10px 20px 10px 0;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    position: relative;
    max-width: 300px;
  }

  .evergreen-profile-meta-name:after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    border-right: 1px solid var(--main-border);
  }

  .evergreen-profile-meta-header {
    padding: 10px 10px 10px 10px;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    position: relative;
    max-width: 300px;
  }

  .header-amount {
    text-align: right;
  }

  .evergreen-profile-meta-value {
    padding: 10px 10px 10px 20px;
  }

  .evergreen-profile-meta-amount {
    text-align: right;
    white-space: nowrap;
    text-overflow: unset;
  }

  :global(.underline-links .evergreen-profile-meta a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .evergreen-profile-meta {
      padding: 5px 0;
    }
    .evergreen-profile-meta-cell {
      font-size: 0.8em;
    }
    .evergreen-profile-meta-name {
      padding: 5px 10px 5px 0;
      max-width: 40vw;
    }
    .evergreen-profile-meta-value {
      padding: 5px 10px 5px 10px;
    }
  }
</style>