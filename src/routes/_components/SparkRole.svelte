<script>
  import EntityDisplayName from './EntityDisplayName.svelte'
  import Avatar from './Avatar.svelte'
  import { unwrap } from '../_utils/mapper'

  export let spark
  export let roleLabel = 'Artist'
</script>

<div class="role-panel">
    <div class="avatar">
        <a id="link-avatar-{roleLabel}"
           href="/sparks/{unwrap(spark.id)}"
           sapper:prefetch
        >
            <Avatar entity={spark} size="small" isLink=true />
        </a>
    </div>
    <span class="role-label">{roleLabel}</span>
    <a id="link-name-{roleLabel}"
       href="/sparks/{unwrap(spark.id)}"
       sapper:prefetch
       class="spark-link"
    >
        <EntityDisplayName entity={spark} />
    </a>
</div>

<style>
    .role-panel {
        display: grid;
        grid-template-areas:
                "avatar name"
                "avatar role";
        grid-template-columns: auto max-content;
        grid-template-rows: max-content max-content;
        grid-column-gap: 10px;
        grid-row-gap: 5px;
        justify-content: left;
    }
    .avatar {
        grid-area: avatar;
    }
    .role-label {
        grid-area: role;
        color: var(--very-deemphasized-text-color);
        font-size: 1.0em;
        font-weight: 600;
        align-self: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }
    .spark-link {
        grid-area: name;
        align-self: center;
        font-size: 1.1em;
        min-width: 0;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .spark-link, .spark-link:hover, .spark-link:visited {
        color: var(--body-text-color);
    }
</style>