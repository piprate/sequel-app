<script>
  import Shortcut from '../../shortcut/Shortcut.svelte'
  import SvgIcon from '../../SvgIcon.svelte'
  import { A11yDialog } from '../../../_thirdparty/a11y-dialog/a11y-dialog'
  import { classname } from '../../../_utils/classname'
  import {on, emit, removeListener} from '../../../_utils/eventBus'
  import {
    pushShortcutScope,
    popShortcutScope
  } from '../../../_utils/shortcuts'
  import {createEventDispatcher, onMount} from "svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let label;
  export let title = undefined;
  export let className = undefined;
  export let shrinkWidthToFit = false;
  export let background;
  export let muted = false;
  export let clickHeaderToClose = false;

  // don't animate if we're showing a modal dialog on top of another modal dialog. it looks ugly
  let shouldAnimate = !process.browser || document.getElementsByClassName('modal-dialog').length < 2;
  let fadedIn = false;

  let statePopped;
  let statePushed;
  let _a11yDialog;

  $: backdropClass = classname(
          'modal-dialog-backdrop',
          !fadedIn && 'hidden',
          shouldAnimate && 'should-animate'
  );

  $: contentsClass = classname(
          'modal-dialog-contents',
          !fadedIn && 'hidden',
          muted && 'muted-style',
          shouldAnimate && 'should-animate',
          shrinkWidthToFit && 'shrink-width-to-fit',
          className
  );

  function closeDialog(otherId) {
     if (id !== otherId) {
      return
    }
    _a11yDialog.hide();
  }

  function onPopState(event) {
    if (!(event.state && event.state.modal === id)) {
      // If the new state is not us, just assume that we need to be closed.
      // This will only fail if modals are ever nested more than 2 levels deep.
      statePopped = true;
      closeDialog(id);
    }
  }

  function showDialog (otherId) {
    if (otherId !== id) {
      return
    }
    // This setTimeout is dumb, but it fixes issues with modals opening other modals
    // due to the popstate/pushstate dance.
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.addEventListener('popstate', onPopState);
        statePushed = true;
        window.history.pushState({ modal: id }, null, location.href);
        document.body.classList.toggle('modal-open', true);
        _a11yDialog.show()
        fadedIn = true;
        dispatch('show');
        emit('dialogDidRender', id);
      })
    })
  }

  function onClickHeader (e) {
    if (clickHeaderToClose) {
      e.preventDefault();
      e.stopPropagation();
      _a11yDialog.hide();
    }
  }

  let node;

  onMount(() => {
    const dialogElement = node.parentElement;
    _a11yDialog = new A11yDialog(dialogElement);
    _a11yDialog.on('hide', () => {
      document.body.classList.toggle('modal-open', false);
      dispatch('close');
      _a11yDialog.destroy();
      emit('destroyDialog', id);
      requestAnimationFrame(() => document.body.removeChild(dialogElement));
    })
    const unsubscribeShowDialog = on('showDialog', showDialog);
    const unsubscribeCloseDialog = on('closeDialog', closeDialog);
    pushShortcutScope(`modal-${id}`);

    return () => {
      unsubscribeShowDialog();
      unsubscribeCloseDialog();

      window.removeEventListener('popstate', onPopState);
      if (statePushed && !statePopped) {
        // If we weren't closed due to popstate, then pop state to ensure the correct history.
        window.history.back();
      }
      popShortcutScope(`modal-${id}`);
    }
  });
</script>

<div class={backdropClass}
     tabindex="-1"
     data-a11y-dialog-hide
></div>
<div class={contentsClass}
     role="dialog"
     aria-label={label || ''}
     bind:this={node}
>
  <div class="modal-dialog-document" role="document" style="background: {background || '#000'};">
    <div class="modal-dialog-header" on:click="{onClickHeader}">
      {#if title}
        <h1 class="modal-dialog-title">{title}</h1>
      {/if}
      <div class="close-dialog-button-wrapper">
        <button class="close-dialog-button focus-fix"
                data-a11y-dialog-hide aria-label="{intl.closeDialog}">
          <SvgIcon className="close-dialog-button-svg" href="#fa-times" />
        </button>
      </div>
    </div>
    <slot></slot>
  </div>
</div>
<Shortcut scope="modal-{id}" key="Backspace" on:pressed="{closeDialog}"/>
<style>
  :global(.modal-dialog[aria-hidden='true']) {
    display: none;
  }
  :global(.modal-dialog) {
    position: fixed;
    z-index: 10000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-dialog-backdrop {
    position: fixed;
    z-index: 10010;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(51, 51, 51, 0.9);
  }
  .modal-dialog-backdrop.should-animate {
    transition: opacity 0.2s linear;
  }
  .modal-dialog-contents {
    z-index: 10020;
    padding: 0;
    border: 1px solid var(--main-border);
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    max-height: calc(100% - 20px);
    max-width: calc(100% - 20px);
    flex: 0 1 580px;
  }
  .modal-dialog-contents.should-animate {
    transition: opacity 0.2s linear;
  }

  .modal-dialog-document {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    flex: 1;
  }
  .modal-dialog-header {
    width: 100%;
    background: var(--nav-bg);
    display: flex;
    align-items: center;
  }
  .modal-dialog-title {
    color: var(--nav-text-color);
    padding: 2px 0 2px 10px;
    margin: 0;
    font-size: 1.5em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .close-dialog-button-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .close-dialog-button {
    padding: 0;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(.close-dialog-button-svg) {
    padding: 10px;
    fill: var(--button-primary-text);
    width: 24px;
    height: 24px;
    flex: 1;
  }
  .muted-style .modal-dialog-header {
    background: var(--muted-modal-bg);
  }
  .muted-style .close-dialog-button:focus {
    outline: 2px solid var(--muted-modal-focus);
  }
  .muted-style .close-dialog-button:hover {
    background: var(--muted-modal-hover);
  }
  .muted-style.modal-dialog-contents {
    border: none;
  }
  :global(body.modal-open) {
    overflow-y: hidden;
  }

  @media(min-width: 480px) {
    /* On desktop, some dialogs look bad if they expand to fit all the way. So we shrink
       them to fit if shrinkWidthToFit is true.*/
    .modal-dialog-contents.shrink-width-to-fit {
      flex: none;
    }
  }

  @media (max-width: 320px) {
    .modal-dialog-title {
      font-size: 1.3em;
    }
    :global(.close-dialog-button-svg) {
      padding: 7px;
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 240px) {
    .modal-dialog-contents {
      min-width: calc(100% - 20px);
    }
  }
</style>
