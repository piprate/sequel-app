<script>
  import SparkProfileHeader from './SparkProfileHeader.svelte'
  import SparkProfileSubscribe from './SparkProfileSubscribe.svelte'
  import SparkProfileSwitch from './SparkProfileSwitch.svelte'
  import SparkProfileSummary from './SparkProfileSummary.svelte'
  import SparkProfileDetails from './SparkProfileDetails.svelte'
  import NFTMediaTag from '../NFTMediaTag.svelte'
  import { autoplayGifs, underlineLinks } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import SparkProfileFilters from './SparkProfileFilters.svelte'

  export let spark
  export let relationship
  export let ourSpark
  export let filter

  $: headerImageIsMissing = !spark.header
  $: headerImage = spark.header ? ($autoplayGifs ? spark.header.url : spark.header.staticUrl) : ''
  $: headerNft = spark.header && spark.header.partOf
  $: sparkName = (spark && (spark.name || spark.handle)) || ''
  $: className = classname(
    'spark-profile',
    headerImageIsMissing && 'header-image-is-missing',
    $underlineLinks && 'underline-links'
  )
  $: profileForSpark = formatIntl('intl.profileForSpark', { spark: sparkName })

  let sparkProfile

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(sparkProfile))
  })
</script>

<h1 class="sr-only">{profileForSpark}</h1>
<div class={className} style="background-image: url({headerImage}?id={spark.header?.id});" bind:this={sparkProfile}>
  <div class="spark-profile-grid-wrapper">
    <div class="spark-profile-grid">
      <SparkProfileHeader {spark} {relationship} />
      <SparkProfileSwitch {spark} {relationship} {ourSpark} />
      <SparkProfileSubscribe {spark} {relationship} {ourSpark} />
      <SparkProfileSummary {spark} />
      <!--      <SparkProfileMeta {spark} />-->
      <SparkProfileDetails {spark} {relationship} {ourSpark} />
    </div>
  </div>
  <SparkProfileFilters {spark} {filter} />
</div>
{#if headerNft}
  <NFTMediaTag nft={headerNft} position="top" />
{/if}

<style>
  .spark-profile {
    position: relative;
    background-size: cover;
    background-position: center;
    padding-top: 175px;
  }

  .spark-profile.header-image-is-missing {
    padding-top: 0;
    background-color: #ccc;
  }

  .spark-profile-grid {
    display: grid;
    grid-template-areas:
      'avatar     name        label       relationship  subscription'
      'avatar     username    username    username      subscription'
      'avatar     properties  properties  properties    subscription'
      'note       note        note        note          note'
      'meta       meta        meta        meta          meta'
      'details    details     details     details       details';
    grid-template-columns: min-content auto 1fr 1fr min-content;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.spark-profile-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--spark-profile-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.spark-profile-grid-wrapper) {
      background-color: var(--spark-profile-bg);
    }
  }

  @media (max-width: 767px) {
    .spark-profile {
      padding-top: 100px;
    }

    .spark-profile-grid {
      display: grid;
      grid-template-areas:
        'avatar      name          subscription'
        'avatar      label         subscription'
        'avatar      username      subscription'
        'avatar      relationship  subscription'
        'note        note          note'
        'properties  properties    properties'
        'meta        meta          meta'
        'details     details       details';
      grid-template-columns: min-content minmax(auto, 1fr) min-content;
      grid-template-rows: min-content min-content 1fr min-content;
      padding: 10px;
    }
  }

  @media (max-width: 320px) {
    .spark-profile {
      padding-top: 50px;
    }
  }

  @media (max-width: 240px) {
    .spark-profile {
      padding-top: 0;
    }
    .spark-profile-grid {
      grid-template-areas:
        'avatar       name'
        'avatar       label'
        'username     username'
        'relationship relationship'
        'subscription subscription'
        'note         note'
        'properties   properties'
        'meta         meta'
        'details      details';
      grid-template-columns: min-content 1fr;
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
