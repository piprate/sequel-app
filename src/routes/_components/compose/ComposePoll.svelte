<script>
  import IconButton from '../IconButton.svelte';
  import Select from '../Select.svelte';
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask';
  import { POLL_EXPIRY_DEFAULT, POLL_EXPIRY_OPTIONS } from '../../_static/polls';
  import { formatIntl } from '../../_utils/formatIntl';
  import { onMount } from "svelte";
  import { getComposeData, setComposeData } from '../../_store/local';

  export let realm;
  export let poll;

  function flushPollOptionsToDom (poll, realm) {
    for (let i = 0; i < poll.options.length; i++) {
      const element = document.getElementById(`poll-option-${realm}-${i}`)
      element.value = poll.options[i]
    }
  }

  let pollExpiryOptions = POLL_EXPIRY_OPTIONS;
  let pollExpiryDefaultValue = POLL_EXPIRY_DEFAULT;

  function createLabel(i) {
    return formatIntl('intl.pollChoiceLabel', { index: i + 1 })
  }

  function createRemoveLabel(i) {
    return formatIntl('intl.removePollChoice', { index: i + 1 })
  }

  function onChange (i) {
    scheduleIdleTask(() => {
      const element = document.getElementById(`poll-option-${realm}-${i}`);
      const poll = getComposeData(realm, 'poll');
      poll.options[i] = element.value;
      setComposeData(realm, { poll });
    })
  }

  function onMultipleChange () {
    scheduleIdleTask(() => {
      const element = document.getElementById(`poll-option-multiple-${realm}`)
      const poll = getComposeData(realm, 'poll')
      poll.multiple = !!element.checked
      setComposeData(realm, { poll })
    })
  }

  function onDeleteClick (i) {
    scheduleIdleTask(() => {
      const poll = getComposeData(realm, 'poll');
      poll.options.splice(i, 1);
      setComposeData(realm, { poll });
      flushPollOptionsToDom(poll, realm);
    })
  }

  function onAddClick () {
    scheduleIdleTask(() => {
      const poll = getComposeData(realm, 'poll');
      if (!poll.options.length !== 4) {
        poll.options.push('')
      }
      setComposeData(realm, { poll });
    })
  }

  function onExpiryChange (e) {
    scheduleIdleTask(() => {
      const { value } = e.target
      const poll = getComposeData(realm, 'poll')
      poll.expiry = parseInt(value, 10)
      setComposeData(realm, { poll })
    })
  }

  onMount(() => {
    const poll = getComposeData(realm, 'poll')
    flushPollOptionsToDom(poll, realm)
    document.getElementById(`poll-option-multiple-${realm}`).checked = !!poll.multiple
    pollExpiryDefaultValue = poll.expiry || POLL_EXPIRY_DEFAULT;
  });
</script>

<section class="compose-poll" aria-label="{intl.createPoll}">
  {#each poll.options as option, i}
    <input id="poll-option-{realm}-{i}"
           type="text"
           maxlength="25"
           on:change="{ () => onChange(i) }"
           placeholder="{createLabel(i)}"

    >
    <IconButton
            label="{createRemoveLabel(i)}"
            href="#fa-times"
            muted={true}
            on:click="{ () => onDeleteClick(i) }"
    />
  {/each}
  <div>
    <input type="checkbox"
           id="poll-option-multiple-{realm}"
           on:change="{onMultipleChange}"
    >
    <label class="multiple-choice-label"
           for="poll-option-multiple-{realm}">
      {intl.multipleChoice}
    </label>
    <Select className="poll-expiry-select"
            options={pollExpiryOptions}
            defaultValue={pollExpiryDefaultValue}
            on:change="{onExpiryChange}"
            label="{intl.pollDuration}"
    />
  </div>
  <IconButton
          className="add-poll-choice-button"
          label="Add choice"
          href="#fa-plus"
          muted={true}
          disabled={poll.options.length === 4}
          on:click="{onAddClick}"
  />
  {#each poll.options as option, i}
    <label id="poll-option-label-{realm}-{i}"
           class="sr-only"
           for="poll-option-{realm}-{i}">
      Choice {i + 1}
    </label>
  {/each}
</section>
<style>
  .compose-poll {
    margin: 10px 0 10px 5px;
    display: grid;
    grid-template-columns: minmax(0, max-content) max-content;
    grid-row-gap: 10px;
    align-items: center;
  }

  :global(.poll-expiry-select) {
    margin-left: 10px;
  }

  .multiple-choice-label {
    margin-left: 5px;
  }

  @media (max-width: 767px) {
    :global(.poll-expiry-select) {
      display: block;
      margin-left: 0;
      margin-top: 10px;
    }
    :global(.add-poll-choice-button) {
      align-self: flex-start;
    }
  }
</style>