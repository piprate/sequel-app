<script>
  import AccountProfilePage from '../../../_components/profile/AccountProfilePage.svelte'

  export let params;
</script>

<AccountProfilePage accountId={params.accountId} filter="with_replies" />
