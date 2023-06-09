<script>
  const TIME_TO_SHOW_TOAST = 5000
  const DELAY_BETWEEN_TOASTS = 1000

  let text = ''
  let shown = false
  let messages = []
  let _queue = Promise.resolve()

  $: {
    if (messages.length) {
      onNewToast(messages[0])
      messages.splice(0, 1)
    }
  }

  export function say(_text) {
    messages.push(_text)
    messages = messages
  }

  function onNewToast(_text) {
    _queue = _queue
      .then(() => {
        text = _text
        shown = true
        return new Promise((resolve) => {
          setTimeout(resolve, TIME_TO_SHOW_TOAST)
        })
      })
      .then(() => {
        shown = false
        return new Promise((resolve) => {
          setTimeout(resolve, DELAY_BETWEEN_TOASTS)
        })
      })
  }
</script>

<div class="toast-modal {shown ? 'shown' : ''}" role="alert" aria-hidden={!shown}>
  <div class="toast-container">
    {text}
  </div>
</div>

<style>
  .toast-modal {
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s linear;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    z-index: 100000;
  }

  .toast-container {
    max-width: 600px;
    max-height: 20vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid var(--toast-border);
    background: var(--toast-bg);
    border-radius: 5px;
    margin: 0 40px;
    padding: 20px;
    font-size: 1.3em;
    color: var(--toast-text);
  }

  .toast-modal.shown {
    opacity: 0.9;
  }

  @media (max-width: 767px) {
    .toast-container {
      max-width: 80vw;
    }
  }
</style>
