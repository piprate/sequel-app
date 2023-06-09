<script>
  export let listing

  $: price = listing.price || 0
  $: priceText = price === 0 ? 'intl.free' : `${price} ${listing.currency}`
</script>

<h2 class="sr-only">{intl.priceInformation}</h2>
<div class="price-banner">
  <div class="price-text">
    {intl.realisedPrice}
  </div>
  <div class="price-amount">
    {priceText}
  </div>
</div>

<style>
  .price-banner {
    grid-area: controls;
    padding: 10px 0;
    font-size: 1em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    display: grid;
    grid-template-columns: minmax(0, max-content) max-content;
    grid-gap: 5px;
    align-items: baseline;
    justify-content: left;
  }

  .price-text {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .price-amount {
    font-size: 1.5em;
  }

  @media (max-width: 767px) {
    .price-banner {
      padding: 5px 0;
    }
  }
</style>
