<script>
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'
  import LoadingSpinner from '../../LoadingSpinner.svelte'
  import { getRecentPostsForSpark } from '../../../_actions/getRecentPostsForSpark'
  import { postBodyToPlainText } from '../../../_utils/postBodyToPlainText'
  import { toast } from '../../toast/toast'
  import { currentInstance } from '../../../_store/local'
  import { reportPosts } from '../../../_actions/reportPosts'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from "svelte";
  import { unwrap } from '../../../_utils/mapper';

  export let id;
  export let label;
  export let title;
  export let post;
  export let spark;


  let positiveText = 'intl.report';
  let reportMap = {};
  let recentPosts = [];
  let loading = true;
  let forward = false;
  let comment = '';

  $: displayPosts = (
          posts.map(post => ({
            id: post.id,
            text: postBodyToPlainText(post) || 'intl.noContent',
            report: reportMap[post.id]
          }))
  );
  $: posts = (
          [post].concat((recentPosts || []).filter(({ id }) => (!post || id !== post.id))).filter(Boolean)
  );
  // $: remoteInstance = post.bubbleRef.name
  $: reportingLabel = (
          formatIntl('intl.reportingLabel', {
            spark: spark.name,
            instance: $currentInstance
          })
  );
  // $: forwardDescription = (
  //         formatIntl('intl.forwardDescription', {
  //           instance: remoteInstance
  //         })
  // )
  // $: forwardLabel = (
  //         formatIntl('intl.forwardLabel', {
  //           instance: remoteInstance
  //         })
  // )

  function onChange (postId, event) {
    reportMap[postId] = event.target.checked
  }

  async function doReport() {
    const postIds = displayPosts.map(({ id }) => id).filter(id => reportMap[id])
    if (!postIds.length) {
      toast.say('intl.noPosts')
    } else {
      await reportPosts(postIds, spark.id, comment)
    }
  }

  onMount(async () => {
    if (post) {
      reportMap[post.id] = true
    }
    try {
      recentPosts = await getRecentPostsForSpark(unwrap(spark.id))
      console.log('recentPosts', recentPosts)
    } catch (err) {
      console.error(err)
      /* no await */ toast.say(formatIntl('intl.unableToLoadPosts', { error: (err.message || '') }))
    } finally {
      loading = false;
    }
  });
</script>

<GenericConfirmationDialog
  {id}
  {label}
  {title}
  className="report-dialog-contents"
  {positiveText}
  on:positive="{doReport}">
  <div class="report-dialog">
    <div class="report-flex">
      <div class="recent-posts">
        {#if loading}
          <div class="loading-spinner-container">
            <LoadingSpinner />
          </div>
        {:else}
          <ul>
            {#each displayPosts as post (post.id)}
              <li>
                <input type="checkbox"
                       id="post-report-{post.id}"
                       name="post-report-{post.id}"
                       checked={post.report}
                       on:change="{ (event) => onChange(post.id, event) }"
                >
                <label for="post-report-{post.id}">
                  {post.text}
                </label>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      <div class="report-info">
        <p>{reportingLabel}</p>
        <label class="sr-only" id="comments-label" for="comments-textarea">{intl.additionalComments}</label>
        <textarea bind:value="{comment}"
                  id="comments-textarea"
                  placeholder="{intl.additionalComments}"
                  aria-labelledby="comments-label"
                  maxlength="1000"></textarea>
        <!-- {#if remoteInstance}
          <p>{forwardDescription}</p>
          <input type="checkbox"
                 id="report-forward"
                 name="report-forward"
                 bind:checked="{forward}">
          <label for="report-forward">
            {forwardLabel}
          </label>
        {/if} -->
      </div>
    </div>
  </div>
</GenericConfirmationDialog>
<style>
  :global(.report-dialog-contents .confirmation-dialog-form) {
    max-width: 80vw;
  }
  .report-dialog {
    padding: 20px 40px;
    overflow-y: auto;
  }
  .loading-spinner-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul {
    list-style: none;
    max-height: 30vh;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid var(--main-border);
  }
  li {
    padding: 10px 5px;
    border-top: 1px solid var(--main-border);
  }
  li:first-child {
    border-top: none;
  }

  .recent-posts label {
    padding: 10px 5px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  textarea {
    width: 100%;
    overflow-y: auto;
    max-height: 40vh;
    font-size: 1.3em;
    min-height: 100px;
  }
  p {
    margin: 20px 0;
  }

  .recent-posts li {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .recent-posts input {
    margin-right: 10px;
  }
  .recent-posts label {
    width: 0;
    flex: 1;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    border-left: 1px solid var(--main-border);
    padding-left: 10px;
  }

  .report-flex {
    display: flex;
    flex-direction: row;
  }

  .report-flex > * {
    flex: 1;
  }

  .report-info {
    margin-left: 20px;
  }

  @media (max-width: 767px) {
    .report-dialog {
      padding: 20px;
      overflow-x: hidden;
      max-height: 65vh;
    }
    .report-flex {
      flex-direction: column;
    }
    .report-info {
      margin-left: 0;
    }
    textarea {
      max-height: 20vh;
    }
    p, label {
      word-wrap: break-word;
    }
    :global(.report-dialog-contents .confirmation-dialog-form) {
      max-width: calc(100% - 20px);
    }
  }
</style>
