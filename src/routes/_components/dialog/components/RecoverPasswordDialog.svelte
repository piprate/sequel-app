<script>
  import ForgotPassword from '../../password_recover/ForgotPassword.svelte'
  import RecoveryPhrase from '../../password_recover/RecoveryPhrase.svelte'
  import ModalDialog from './ModalDialog.svelte'

  export let id
  export let email

  const label = 'Recover Password'
  const title = 'Recover your password'

  let instance
  let recoveryCode

  async function setValues (values) {
    recoveryCode = values.recoveryCode
    email = values.email
    instance = values.instance
  }
</script>

<ModalDialog
  {id}
  {label}
  {title}
  on:close={() => {
    window.location.hash = ''
  }}
  shrinkWidthToFit={false}
  background="var(--main-bg)"
>
  {#if recoveryCode}
    <RecoveryPhrase dialogId={id} {email} {instance} {recoveryCode} />
  {:else}
    <ForgotPassword {email} {setValues} />
  {/if}
</ModalDialog>
