<script>
  import { doubleRAF } from '../../_utils/doubleRAF'
  import SvgIcon from '../SvgIcon.svelte'

  let shown = false
  let text = ''
  let buttonText = ''
  let buttonAction = null

  export function announce(_text, _buttonText, _buttonAction) {
    text = _text
    buttonText = _buttonText
    buttonAction = _buttonAction
    doubleRAF(() => {
      shown = true
    })
  }

  function onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (buttonAction) {
      buttonAction()
    }
    close()
  }

  function close(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    requestAnimationFrame(() => {
      buttonAction = null // avoid memory leaks from the closure
      shown = false
    })
  }
</script>

<section
  class="snackbar-modal {shown ? 'shown' : ''}"
  aria-live="assertive"
  aria-atomic="true"
  aria-hidden={!shown}
  aria-label={intl.alert}
>
  <div class="snackbar-container">
    <span class="text">
      {text}
    </span>
    <div class="button-wrapper">
      <button class="button" on:click={onClick}>
        {buttonText}
      </button>
      <button class="button" aria-label={intl.close} on:click={close}>
        <SvgIcon className="close-snackbar-button" href="#fa-times" />
      </button>
    </div>
  </div>
</section>

<style>
  .snackbar-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transition: transform 333ms ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 99000;
    transform: translateY(100%);
  }

  /* For iOS < 11.2 */
  @supports (padding-bottom: constant(safe-area-inset-bottom)) {
    .snackbar-container {
      --safe-area-inset-bottom: constant(safe-area-inset-bottom);
    }
  }

  /* For iOS >= 11.2 */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .snackbar-container {
      --safe-area-inset-bottom: env(safe-area-inset-bottom);
    }
  }

  .snackbar-container {
    width: 562px; /* same as .main, minus 20px padding */
    overflow: hidden;
    display: flex;
    align-items: center;
    background: var(--toast-bg);
    padding: 10px 20px calc(10px + var(--safe-area-inset-bottom)) 20px;
    font-size: 1.3em;
    color: var(--toast-text);
    border-radius: 4px 4px 0 0;
    border: 1px solid var(--toast-border);
    border-bottom: none;
  }

  .button-wrapper {
    display: flex;
    align-items: center;
  }

  .text {
    flex: 1;
  }

  button {
    font-size: 1em;
    border: none;
    color: var(--toast-anchor-color);
    text-transform: uppercase;
    font-weight: 500;
    background: var(--toast-bg);
    margin-left: 5px;
  }

  button:active {
    background: var(--toast-button-active);
  }

  button:hover {
    background: var(--toast-button-hover);
  }

  .snackbar-modal.shown {
    transform: translateY(0);
  }

  :global(.close-snackbar-button) {
    margin-top: 3px;
    width: 18px;
    height: 18px;
    fill: var(--toast-text);
  }

  @media (max-width: 767px) {
    .snackbar-container {
      width: calc(100% - 20px);
    }
    button {
      margin-left: 0;
      padding: 7px 10px;
    }
  }

  @media (max-width: 479px) {
    button {
      font-size: 0.9em;
    }
    :global(.close-snackbar-button) {
      width: 14px;
      height: 14px;
    }
    .text {
      font-size: 0.9em;
    }
  }
</style>
