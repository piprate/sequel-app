import { slide as svelteSlide } from 'svelte/transition'
import { reduceMotion } from '../_store/local'
import noop from 'lodash-es/noop'

// same as svelte-transitions, but respecting reduceMotion
export function slide(node, ref) {
  if (reduceMotion.get()) {
    return {
      delay: 0,
      duration: 1, // setting to 0 causes some kind of built-in duration
      easing: (_) => _,
      css: noop
    }
  }
  return svelteSlide(node, ref)
}
