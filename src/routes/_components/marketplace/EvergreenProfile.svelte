<script>
  import { roleName } from '../../_utils/evergreen'

  export let profile;

  $: roles = profile.roles || [];
  $: rolesForDisplay = (roles.map(role => ({
    role: roleName(role.id, role.description),
    receiver: `0x${role.addr}`,
    primaryRate: ((role.initialSaleCommission || 0.0) * 100.0).toFixed(2)+"%",
    secondaryRate: ((role.secondaryMarketCommission || 0.0) * 100.0).toFixed(2)+"%",
  })));
</script>

{#if rolesForDisplay.length}
  <div class="evergreen-profile-meta">
    <div class="evergreen-profile-header">
      <h2>{intl.evergreenProfile}</h2>
    </div>
    <div
            id="evergreen-profile-meta-role-head"
            class="evergreen-profile-meta-cell evergreen-profile-meta-header-name"
            role="term"
    >
      {intl.evergreenHeaderRole}
    </div>
    <div
            class="evergreen-profile-meta-cell evergreen-profile-meta-header header-amount"
            role="definition"
            aria-labelledby="evergreen-profile-meta-role-head"
    >
      {intl.evergreenHeaderPrimary}
    </div>
    <div
            class="evergreen-profile-meta-cell evergreen-profile-meta-header header-amount"
            role="definition"
            aria-labelledby="evergreen-profile-meta-role-head"
    >
      {intl.evergreenHeaderSecondary}
    </div>
    <div class="evergreen-profile-meta-border"></div>
    {#each rolesForDisplay as role, i}
      <div
              id="evergreen-profile-meta-role-{i}"
              class="evergreen-profile-meta-cell evergreen-profile-meta-role"
              role="term"
      >
        <div class="evergreen-profile-meta-name">{role.role}</div>
        <div class="evergreen-profile-meta-address">{role.receiver}</div>
      </div>
      <div
              class="evergreen-profile-meta-cell evergreen-profile-meta-value evergreen-profile-meta-amount"
              role="definition"
              aria-labelledby="evergreen-profile-meta-role-{i}"
      >
        {role.primaryRate}
      </div>
      <div
              class="evergreen-profile-meta-cell evergreen-profile-meta-value evergreen-profile-meta-amount"
              role="definition"
              aria-labelledby="evergreen-profile-meta-role-{i}"
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
    grid-template-columns: 2fr 1fr 1fr;
    grid-row-gap: 5px;
    padding: 20px 0;
  }

  .evergreen-profile-header {
    grid-column: 1 / 4;
  }

  .evergreen-profile-header h2 {
    font-size: 1.5em;
  }

  .evergreen-profile-meta-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 4;
    background: var(--main-border);
    justify-self: center;
  }

  .evergreen-profile-meta-cell {
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.0em;
  }

  .evergreen-profile-meta-role {
    padding: 0 20px 5px 0;
    position: relative;
    max-width: 300px;
  }

  .evergreen-profile-meta-role:after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    border-right: 1px solid var(--main-border);
  }

  .evergreen-profile-meta-name {
    text-transform: uppercase;
  }

  .evergreen-profile-meta-address {
    color: var(--deemphasized-text-color);
  }

  .evergreen-profile-meta-header-name {
    padding: 0 10px 0 0;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    max-width: 300px;
  }

  .evergreen-profile-meta-header {
    padding: 0 10px 0 10px;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    position: relative;
    max-width: 300px;
  }

  .header-amount {
    text-align: right;
  }

  .evergreen-profile-meta-value {
    padding: 0 10px 10px 20px;
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
    .evergreen-profile-meta-role {
      padding: 0 10px 5px 0;
      max-width: 40vw;
    }
    .evergreen-profile-meta-value {
      padding: 0 10px 5px 10px;
    }
  }
</style>