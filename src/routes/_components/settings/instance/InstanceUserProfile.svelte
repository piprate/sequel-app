<script>
  import Avatar from '../../Avatar.svelte'
  import UserDisplayName from '../../user/UserDisplayName.svelte'
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'

  export let user
  export let spark
</script>

<div class="generic-instance-settings current-user">
  <div class="acct-avatar">
    {#if spark}
      <Avatar entity={spark} size="big" />
    {/if}
  </div>
  <span class="acct-handle">
    {user.email}
  </span>
  <span class="user-display-name">
    <UserDisplayName {user} />
  </span>
</div>
<GenericInstanceSettingsStyle />

<style>
  .current-user {
    line-height: 1.4;
    display: grid;
    align-items: center;
    font-size: 1.3em;
    grid-template-areas:
      'avatar handle'
      'avatar display-name';
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
  .user-display-name {
    grid-area: display-name;
  }
</style>
