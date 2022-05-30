<script>
  import FreeTextLayout from './FreeTextLayout.svelte'
  import HiddenFromSSR from './HiddenFromSSR.svelte'
  import SvgIcon from './SvgIcon.svelte'

  export let message = 'intl.accessRestricted'
  export let showLogo = false
</script>

<HiddenFromSSR>
    <FreeTextLayout>
        <div class="not-logged-in-box">
            {#if showLogo}
                <div class="banner">
                    <SvgIcon className="not-logged-in-box-svg" href="#sequel-logo" />
                    <div class="app-name">{intl.appName}<span class="beta">beta</span></div>
                    <span class="slogan">{intl.slogan}</span>
                </div>
            {/if}
            <div>
                {@html message}
            </div>
            <p style="text-align: right;">
                <a class="button primary" sapper:prefetch href="/settings/instances/register">{intl.signUp}</a>
                <a class="button primary" sapper:prefetch href="/settings/instances/add">{intl.logIn}</a>
            </p>
        </div>
    </FreeTextLayout>
</HiddenFromSSR>

<style>
    .not-logged-in-box {
        margin: 10px;
    }
    .not-logged-in-box .banner {
        display: grid;
        grid-template-areas: "logo name"
                             "logo slogan";
        grid-template-columns: min-content auto 1fr 1fr min-content;
        grid-column-gap: 10px;
        align-items: center;
        margin: 0 0 30px;
    }
    :global(.not-logged-in-box-svg) {
        width: 70px;
        height: 70px;
        fill: var(--banner-fill);
        grid-area: logo;
    }
    .app-name {
        color: var(--banner-fill);
        font-size: 3em;
        margin: auto 15px;
        grid-area: name;
    }

    .beta {
        color: var(--deemphasized-text-color);
        font-size: 0.4em;
        text-transform: uppercase;
        vertical-align: super;
    }

    .slogan {
        color: var(--banner-fill);
        font-size: 0.8em;
        grid-area: slogan;
        text-align: center;
        text-transform: uppercase;
    }

    @media (max-width: 767px) {
        .app-name {
            font-size: 2.7em;
        }
    }
</style>