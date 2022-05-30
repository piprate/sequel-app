<script>
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'
  import LoadingSpinner from '../../LoadingSpinner.svelte'
  import { getRecentStatusesForAccount } from '../../../_actions/getRecentStatusesForAccount'
  import { statusHtmlToPlainText } from '../../../_utils/statusHtmlToPlainText'
  import { toast } from '../../toast/toast'
  import { currentInstance } from '../../../_store/local'
  import { reportStatuses } from '../../../_actions/reportStatuses'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from "svelte";

  export let id;
  export let label;
  export let title;

  let account = undefined;
  let status = undefined;
  let positiveText = 'intl.report';
  let reportMap = {};
  let recentStatuses = [];
  let loading = true;
  let forward = false;
  let comment = '';

  $: displayStatuses = (
          statuses.map(status => ({
            id: status.id,
            text: statusHtmlToPlainText(status.content, status.mentions) || 'intl.noContent',
            report: reportMap[status.id]
          }))
  );
  $: statuses = (
          [status].concat((recentStatuses || []).filter(({ id }) => (!status || id !== status.id))).filter(Boolean)
  );
  $: remoteInstance = account.acct.split('@')[1];
  $: reportingLabel = (
          formatIntl('intl.reportingLabel', {
            account: `@${account.acct}`,
            instance: $currentInstance
          })
  );
  $: forwardDescription = (
          formatIntl('intl.forwardDescription', {
            instance: remoteInstance
          })
  )
  $: forwardLabel = (
          formatIntl('intl.forwardLabel', {
            instance: remoteInstance
          })
  )

  function onChange (statusId, event) {
    reportMap[statusId] = event.target.checked
  }

  async function doReport() {
    const statusIds = displayStatuses.map(({ id }) => id).filter(id => reportMap[id])
    if (!statusIds.length) {
      toast.say('intl.noStatuses')
    } else {
      await reportStatuses(account, statusIds, comment, forward)
    }
  }

  onMount(async () => {
    if (status) {
      reportMap[status.id] = true
    }
    try {
      recentStatuses = await getRecentStatusesForAccount(account.id)
      console.log('recentStatuses', recentStatuses)
    } catch (err) {
      console.error(err)
      /* no await */ toast.say(formatIntl('intl.unableToLoadStatuses', { error: (err.message || '') }))
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
      <div class="recent-statuses">
        {#if loading}
          <div class="loading-spinner-container">
            <LoadingSpinner />
          </div>
        {:else}
          <ul>
            {#each displayStatuses as status (status.id)}
              <li>
                <input type="checkbox"
                       id="status-report-{status.id}"
                       name="status-report-{status.id}"
                       checked={status.report}
                       on:change="{ (event) => onChange(status.id, event) }"
                >
                <label for="status-report-{status.id}">
                  {status.text}
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
        {#if remoteInstance}
          <p>{forwardDescription}</p>
          <input type="checkbox"
                 id="report-forward"
                 name="report-forward"
                 bind:checked="{forward}">
          <label for="report-forward">
            {forwardLabel}
          </label>
        {/if}
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

  .recent-statuses label {
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

  .recent-statuses li {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .recent-statuses input {
    margin-right: 10px;
  }
  .recent-statuses label {
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
