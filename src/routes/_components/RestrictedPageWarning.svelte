<script>
  import FreeTextLayout from './FreeTextLayout.svelte'
  import HiddenFromSSR from './HiddenFromSSR.svelte'
  import SvgIcon from './SvgIcon.svelte'
  import { stores } from '@sapper/app'
  import { redirectToPage } from '../_store/local'

  export let message = 'intl.accessRestricted'
  export let showLogo = false
  export let offerVisitorMode = false

  const { page } = stores()

  $: panelClass = offerVisitorMode ? '' : 'right-align'

  function setRedirect (e) {
    if ($page.path !== '/') {
      $redirectToPage = $page.path
    }
  }
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
            <div class="message">
                {@html message}
            </div>
            <div class={panelClass}>
                <a class="button primary action-button" sapper:prefetch href="/settings/instances/register" on:click="{setRedirect}">{intl.signUp}</a>
                <a class="button primary action-button" sapper:prefetch href="/settings/instances/add" on:click="{setRedirect}">{intl.logIn}</a>
                {#if offerVisitorMode }
                    <span class="visitor-invite">or <a sapper:prefetch href="/settings/instances/visit" on:click="{setRedirect}">{'intl.continueAsVisitorLink'}</a></span>
                {/if}
            </div>
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

    .message {
        margin: 30px 0;
        font-size: 1.2em;
    }

    :global(.message p) {
        margin: 30px 0;
        font-size: 1.2em;
    }

    .action-button {
        margin-right: 5px;
    }

    .right-align {
        text-align: right;
    }

    .visitor-invite {
    }

    @media (max-width: 450px) {
        .visitor-invite {
            display: flow-root;
            margin-top: 15px;
        }
    }

    @media (max-width: 767px) {
        .app-name {
            font-size: 2.7em;
        }
    }
</style>