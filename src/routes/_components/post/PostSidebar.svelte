<script>
  import Avatar from '../Avatar.svelte'
  import { isVeryTinyMobileSize } from '../../_store/local'
  import { unwrap } from '../../_utils/mapper'

  export let uuid
  export let isPostInOwnThread
  export let postAuthor
  export let postAuthorId

  $: elementId = `post-author-avatar-${uuid}`

  $: size = (() => {
    if ($isVeryTinyMobileSize) {
      return isPostInOwnThread ? 'small' : 'extra-small'
    }
    return isPostInOwnThread ? 'medium' : 'small'
  })()
</script>

<a id={elementId}
   class="post-sidebar size-{size}"
   sapper:prefetch
   href="/sparks/{unwrap(postAuthorId)}"
   aria-hidden="true"
   tabindex="-1"
>
  <!-- the avatar is duplicated information, so hide from tab order and screenreaders -->
  <Avatar entity={postAuthor}
          isLink="true"
          {size} />
</a>
<style>
  .post-sidebar {
    grid-area: sidebar;
    margin-right: 15px;
  }

  .post-sidebar.size-small {
    width: 48px;
    height: 48px;
  }

  .post-sidebar.size-medium {
    width: 64px;
    height: 64px;
  }

  @media (max-width: 767px) {
    .post-sidebar {
      margin-right: 5px;
    }
  }
</style>
