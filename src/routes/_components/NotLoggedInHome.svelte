<script>
  import FreeTextLayout from './FreeTextLayout.svelte'
  import HiddenFromSSR from './HiddenFromSSR.svelte'
  import SvgIcon from './SvgIcon.svelte'
</script>

<HiddenFromSSR>
  <FreeTextLayout>
    <div class="not-logged-in-home">
      <div class="banner">
        <SvgIcon className="not-logged-in-home-svg" href="#sequel-logo" />
        <h1>{intl.appName}</h1>
        <span>{intl.slogan}</span>
      </div>
      <div>
        {@html intl.homeDescription}
        <p style="text-align: right;">
          <a class="button primary" sapper:prefetch href="/settings/instances/register">{intl.signUp}</a>
          <a class="button primary" sapper:prefetch href="/settings/instances/add">{intl.logIn}</a>
        </p>
      </div>
    </div>
  </FreeTextLayout>
</HiddenFromSSR>
<style>
  .not-logged-in-home {
    margin: 10px;
  }
  .not-logged-in-home .banner {
    display: grid;
    grid-template-areas: "logo name"
                         "logo slogan";
    grid-template-columns: min-content auto 1fr 1fr min-content;
    grid-column-gap: 10px;
    align-items: center;
    margin: 0 0 30px;
  }
  :global(.not-logged-in-home-svg) {
    width: 70px;
    height: 70px;
    fill: var(--banner-fill);
    grid-area: logo;
  }
  .not-logged-in-home h1 {
    color: var(--banner-fill);
    font-size: 3em;
    margin: auto 15px;
    grid-area: name;
  }

  .not-logged-in-home span {
    color: var(--banner-fill);
    font-size: 0.8em;
    grid-area: slogan;
    text-align: center;
    text-transform: uppercase;
  }

  @media (max-width: 767px) {
    .not-logged-in-home h1 {
      font-size: 2.7em;
    }
  }

  @media (max-width: 240px) {
    .not-logged-in-home h1 {
      font-size: 2.5em;
    }
  }
</style>

