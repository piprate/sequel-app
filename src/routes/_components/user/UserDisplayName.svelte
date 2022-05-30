<script>
  export let user;

  $: userName = user.name || '';
</script>

<span class="user-display-name">{userName}</span>
<style>
  .user-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
