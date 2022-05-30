<script>
  import Avatar from '../Avatar.svelte'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { currentVerifyCredentials } from '../../_store/instance'
  import AccountDisplayName from '../profile/AccountDisplayName.svelte'
  import { ONE_TRANSPARENT_PIXEL } from '../../_static/media'
  import { emit } from '../../_utils/eventBus'
  import { goto } from '@sapper/app';

  export let realm;
  export let dialogId;

  $: loaded = !!$currentVerifyCredentials;
  $: verifyCredentials = (() => {
    // return a placeholder while we're waiting on IndexedDB to load
    // (https://github.com/nolanlawson/pinafore/issues/1076)
    return $currentVerifyCredentials || {
      display_name: '',
      acct: '',
      avatar: ONE_TRANSPARENT_PIXEL,
      avatar_static: ONE_TRANSPARENT_PIXEL
    }
  })();
  $: id = (verifyCredentials && verifyCredentials.id);
  $: href = (id ? `/accounts/${id}` : '#');
  $: avatarSize = $isVeryTinyMobileSize ? 'extra-small' : 'small';

  function onClick (e) {
    if (realm === 'dialog') {
      e.preventDefault()
      e.stopPropagation()
      // in dialog mode, we have to close the dialog and then navigate to the profile
      emit('closeDialog', dialogId)
      setTimeout(() => { // setTimeout to work around dialog navigation issues
        goto(href)
      })
    }
  }
</script>

<a {href}
   rel="prefetch"
   class="compose-box-avatar {loaded ? 'loaded' : 'not-loaded'}"
   aria-hidden="true"
   tabindex="-1"
   on:click="{onClick}"
>
  <!-- the avatar is duplicated information, so hide from tab order and screenreaders -->
  <Avatar account={verifyCredentials} size={avatarSize} />
</a>
<a class="compose-box-display-name {loaded ? 'loaded' : 'not-loaded'}"
   {href}
   aria-busy={!loaded}
   aria-live="off"
   rel="prefetch"
   on:click="{onClick}"
>
  <AccountDisplayName account={verifyCredentials} />
</a>

<span class="compose-box-handle {loaded ? 'loaded' : 'not-loaded'}"
      aria-busy={!loaded}
      aria-live="off"
>
  {'@' + verifyCredentials.acct}
</span>
<style>
  .compose-box-avatar {
    grid-area: avatar;
    margin-right: 15px;
  }
  .compose-box-display-name {
    color: var(--deemphasized-text-color);
    grid-area: name;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
    margin-left: 5px;
    font-weight: 600;
  }
  .compose-box-display-name,
  .compose-box-display-name:hover,
  .compose-box-display-name:visited {
    color: var(--body-text-color);
  }
  :global(.compose-box-handle) {
    grid-area: handle;
    color: var(--deemphasized-text-color);
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
    margin-left: 5px;
  }
  .not-loaded {
    visibility: hidden;
  }
  .loaded {
    visibility: visible;
  }

  @media (max-width: 767px) {
    .compose-box-avatar {
      margin-right: 5px;
    }
  }
  @media (max-width: 240px) {
    .compose-box-avatar {
      margin-right: 0;
    }
  }
</style>