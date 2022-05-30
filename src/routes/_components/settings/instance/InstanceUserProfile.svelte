<script>
  import ExternalLink from '../../ExternalLink.svelte'
  import Avatar from '../../Avatar.svelte'
  import AccountDisplayName from '../../profile/AccountDisplayName.svelte'
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'

  export let verifyCredentials;
</script>

<div class="generic-instance-settings acct-current-user">
  <div class="acct-avatar">
    <Avatar account={verifyCredentials} size="big" />
  </div>
  <ExternalLink className="acct-handle"
                href={verifyCredentials.url} >
    {'@' + verifyCredentials.acct}
  </ExternalLink>
  <span class="acct-display-name">
    <AccountDisplayName account={verifyCredentials} />
  </span>
</div>
<GenericInstanceSettingsStyle />
<style>
  .acct-current-user {
    line-height: 1.4;
    display: grid;
    align-items: center;
    font-size: 1.3em;
    grid-template-areas:
      "avatar handle"
      "avatar display-name";
    grid-template-columns: min-content 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 10px;
  }
  :global(.acct-avatar) {
    grid-area: avatar;
  }
  :global(.acct-handle) {
    grid-area: handle;
  }
  .acct-display-name {
    grid-area: display-name;
  }
</style>

