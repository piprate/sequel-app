<script>
  import AccountDisplayName from '../profile/AccountDisplayName.svelte'

  export let uuid;
  export let isStatusInNotification;
  export let isStatusInOwnThread;
  export let originalAccount;
  export let originalAccountId;

  $: elementId = `status-author-name-${uuid}`;
</script>

<a id={elementId}
   class="status-author-name {isStatusInNotification ? 'status-in-notification' : '' } {isStatusInOwnThread ? 'status-in-own-thread' : ''}"
   rel="prefetch"
   href="/accounts/{originalAccountId}"
   title="{'@' + originalAccount.acct}"
>
  <AccountDisplayName account={originalAccount} />
</a>
<style>
  .status-author-name {
    grid-area: author-name;
    align-self: center;
    margin-left: 5px;
    font-size: 1.1em;
    min-width: 0;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-author-name.status-in-own-thread {
    font-size: 1.3em;
  }

  .status-author-name, .status-author-name:hover, .status-author-name:visited {
    color: var(--body-text-color);
  }

  .status-author-name.status-in-notification,
  .status-author-name.status-in-notification:hover,
  .status-author-name.status-in-notification:visited {
    color: var(--very-deemphasized-text-color);
  }

</style>
