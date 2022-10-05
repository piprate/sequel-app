<script>
  import LoadingPage from './LoadingPage.svelte'
  import ErrorMessage from './ErrorMessage.svelte'
  import Avatar from './Avatar.svelte'
  import SparkDisplayName from './spark/SparkDisplayName.svelte'
  import SearchResult from './search/SearchResult.svelte'
  import SvgIcon from './SvgIcon.svelte'
  import RadioGroup from './radio/RadioGroup.svelte'
  import RadioGroupButton from './radio/RadioGroupButton.svelte'
  import InfoAside from './InfoAside.svelte'
  import FreeTextLayout from './FreeTextLayout.svelte'
  import { toast } from './toast/toast'
  import { on } from '../_utils/eventBus'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from 'svelte'
  import { accessToken, currentSparkId } from '../_store/instance'
  import { currentInstance, isUserLoggedIn } from '../_store/local'
  import { setCurrentSpark } from '../_actions/sparks'
  import { getSparkList } from '../_api/sparks'
  import { goto } from '@sapper/app'
  import { displayError } from '../_actions/errors'

  export let sparksFetcher

  let loading = true
  let sparks = []

  $: sparksFetcher = () => getSparkList($currentInstance, $accessToken)

  async function refreshSparks () {
    sparks = await sparksFetcher() || []
    console.log('SPARKS', sparks)
  }

  function onSwitchToThisSpark (e, sparkState) {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSpark($currentInstance, sparkState.data)
    /* no await */
    toast.say(formatIntl('intl.sparkSelected', { spark: sparkState.name }))
    goto('/')
  }

  $: sparkStates = sparks.map((spark, index) => ({
    id: spark.id,
    index,
    name: spark.name,
    current: ($currentSparkId === spark.id),
    label: formatIntl('intl.currentSparkLabel', { spark: spark.name, current: ($currentSparkId === spark.id) }),
    switchLabel: formatIntl('intl.switchToNameOfSpark', { spark: spark.name }),
    data: spark
  }))

  // TODO: paginate

  let loadError

  onMount(async () => {
    try {
      await refreshSparks()
    } catch (e) {
      displayError(e)
      loadError = 'intl.unableToLoad'
    } finally {
      loading = false
    }
    return on('refreshSparksList', () => refreshSparks())
  })
</script>

{#if $isUserLoggedIn }
<div class="sparks-page">
    <FreeTextLayout>
        <h2>{intl.sparkChoiceQuestion}</h2>
        {#if loading}
            <LoadingPage />
        {:else}
            {#if sparks && sparks.length}
                <RadioGroup id="spark-selector" label="{intl.switchToSpark}" length={sparks.length}>
                    <ul class="sparks-results" aria-label={intl.sparks}>
                        {#each sparkStates as spark}
                            <SearchResult>
                                <div class="search-result-spark" on:click="{ (event) => onSwitchToThisSpark(event, spark) }">
                                    <div class="search-result-spark-avatar">
                                        <Avatar entity={spark.data} size="small" />
                                    </div>
                                    <div class="search-result-spark-name">
                                        <SparkDisplayName spark={spark.data} />
                                    </div>
                                    <div class="search-result-spark-stats">
                                        Posts: {spark.data.postCount || 0} Bubbles: {spark.data.bubbleCount || 0} Subscribers: {spark.data.subscriberCount || 0}
                                    </div>
                                    <div class="spark-selector-button-wrapper">
                                        <RadioGroupButton
                                                id="spark-selector"
                                                className="spark-selector-button"
                                                label={spark.switchLabel}
                                                checked={spark.current}
                                                index={spark.index}>
                                            <SvgIcon className="spark-selector-button-svg"
                                                     href={spark.current ? '#fa-star' : '#fa-star-o'} />
                                        </RadioGroupButton>
                                    </div>
                                </div>
                            </SearchResult>
                        {/each}
                    </ul>
                </RadioGroup>
                <a class="button primary new-spark-button" sapper:prefetch href="/sparks/new">{intl.createNewSpark}</a>
            {:else if loadError}
                <ErrorMessage error={loadError} />
            {:else}
                <a class="button primary new-spark-button" sapper:prefetch href="/sparks/new">{intl.createFirstSpark}</a>
            {/if}
            <InfoAside className="spark-notice-aside">
                {intl.firstSparkNotice}
            </InfoAside>
        {/if}
    </FreeTextLayout>
</div>
{/if}

<style>
    .sparks-page {
        padding: 20px 20px;
        position: relative;
    }
    .sparks-results {
        list-style: none;
        box-sizing: border-box;
        border: 1px solid var(--main-border);
        border-radius: 2px;
    }
    @media (max-width: 767px) {
        .sparks-page {
            padding: 20px 10px;
        }
        .search-result-spark {
            grid-column-gap: 10px;
        }
    }
    .spark-selector-button-wrapper {
        position: relative;
        min-width: 64px;
        min-height: 52px;
        grid-area: button;
    }
    :global(.spark-selector-button) {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        border: none;
        background: none;
        align-items: center;
        justify-content: center;
        margin: 1px;
    }
    :global(.spark-selector-button-svg) {
        width: 32px;
        height: 32px;
        display: inline-block;
        fill: var(--svg-fill);
    }
    .search-result-spark {
        display: grid;
        grid-template-areas:
            "avatar    name     button"
            "avatar    stats    button";
        grid-column-gap: 20px;
        grid-template-columns: max-content 1fr max-content;
        align-items: center;
        cursor: pointer;
    }
    :global(.search-result-spark-avatar) {
        grid-area: avatar;
    }
    .search-result-spark-name {
        grid-area: name;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.2em;
    }
    .search-result-spark-stats {
        grid-area: stats;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--very-deemphasized-text-color);
    }
    .new-spark-button {
        margin: 20px 0 10px 0;
        display: inline-block;
        text-align: center;
    }
    :global(.spark-notice-aside) {
        margin: 10px 10px 0 0;
    }
</style>
