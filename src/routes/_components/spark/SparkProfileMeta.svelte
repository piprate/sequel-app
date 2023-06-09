<script>
  import SvgIcon from '../SvgIcon.svelte'
  import { emojifyText } from '../../_utils/emojifyText'
  import { autoplayGifs } from '../../_store/local'

  export let spark

  $: emojis = spark.emojis || []
  $: fields = spark.fields || []
  $: massagedFields = fields.map((field) => ({
    name: field.name,
    value: emojifyText(field.value, emojis, $autoplayGifs),
    verified: !!field.verified_at
  }))
</script>

{#if massagedFields.length}
  <h2 class="sr-only">{intl.fields}</h2>
  <div class="spark-profile-meta">
    <div class="spark-profile-meta-border" />
    {#each massagedFields as field, i}
      <div id="spark-profile-meta-name-{i}" class="spark-profile-meta-cell spark-profile-meta-name" role="term">
        {field.name}
      </div>
      <div
        class="spark-profile-meta-cell spark-profile-meta-value"
        role="definition"
        aria-labelledby="spark-profile-meta-name-{i}"
      >
        {@html field.value}
      </div>
      <div class="spark-profile-meta-cell spark-profile-meta-verified">
        {#if field.verified}
          <SvgIcon className="spark-profile-meta-verified-svg" href="#fa-check" />
        {/if}
      </div>
    {/each}
    <div class="spark-profile-meta-border" />
  </div>
{/if}

<style>
  .spark-profile-meta {
    grid-area: meta;
    display: grid;
    grid-template-columns: auto 1fr max-content;
    grid-row-gap: 5px;
    align-items: center;
    padding: 10px 0;
  }

  .spark-profile-meta-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 4;
    background: var(--main-border);
    justify-self: center;
  }

  .spark-profile-meta-cell {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    font-size: 1.1em;
  }

  :global(.spark-profile-meta-verified-svg) {
    width: 24px;
    height: 24px;
    fill: var(--svg-fill);
  }

  .spark-profile-meta-name {
    padding: 10px 20px 10px 0;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    position: relative;
    max-width: 300px;
  }

  .spark-profile-meta-name:after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    border-right: 1px solid var(--main-border);
  }

  .spark-profile-meta-value {
    padding: 10px 10px 10px 20px;
  }

  :global(.underline-links .spark-profile-meta a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .spark-profile-meta {
      padding: 5px 0;
    }
    .spark-profile-meta-cell {
      font-size: 1em;
    }
    .spark-profile-meta-name {
      padding: 5px 10px 5px 0;
      max-width: 40vw;
    }
    .spark-profile-meta-value {
      padding: 5px 10px 5px 10px;
    }
  }
</style>
