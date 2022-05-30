import {safeLocalStorage as LS} from "../_utils/safeLocalStorage";
import { safeParse } from "../_utils/safeParse";
import { writable } from "svelte/store";

export function persistentStore(key, initialValue) {
  //console.log("Creating persistent store", key);
  if (process.browser) {
    let val = LS.getItem(`store_${key}`);
    if (val) {
      initialValue = safeParse(val)
    }
  }

  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    get: () => {
      let val;
      const unsubscribe = subscribe(value => {
        val = value;
      });
      unsubscribe();
      return val;
    },
    getKey: (k) => {
      let state;
      const unsubscribe = subscribe(value => {
        state = value;
      });
      unsubscribe()
      return state[k]
    },
    set: (val) => {
      if (process.browser) {
        LS.setItem(`store_${key}`, JSON.stringify(val))
      }
      set(val);
    },
    setKey: (k, val) => {
      console.log("setting key", k, val)
      update((state) => {
        state[k] = val

        if (process.browser) {
          LS.setItem(`store_${key}`, JSON.stringify(state))
        }

        return state
      })
    },
    update: (val) => {
      if (process.browser) {
        LS.setItem(`store_${key}`, JSON.stringify(val))
      }
      return update(val);
    },
  }
}

export function transientStore(initialValue) {
  const { subscribe, set, update } = writable(initialValue);

  return {
    subscribe,
    get: () => {
      let val;
      const unsubscribe = subscribe(value => {
        val = value;
      });
      unsubscribe();
      return val;
    },
    delKey: (key) => update(val => {
      delete val[key];
      return val;
    }),
    set,
    update,
  }
}

export function transientMapStore(state) {
  const { subscribe, set, update } = writable(state);

  return {
    subscribe,
    get: () => {
      let state;
      const unsubscribe = subscribe(value => {
        state = value;
      });
      unsubscribe();
      return state;
    },
    getKey: (key) => {
      let state;
      const unsubscribe = subscribe(value => {
        state = value;
      });
      unsubscribe()
      return state[key]
    },
    setKey: (key, value) => {
      update((state) => {
        state[key] = value
        return state
      })
    },
    del: (key) => {
      update((state) => {
        delete state[key]
        return state
      })
    },
    set: (changed) => {
      update((state) => {
        for (const [key, value] of Object.entries(changed)) {
          state[key] = value
        }
        return state
      })
    },
  }
}