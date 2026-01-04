/**
 * Store utilities
 * @module utils/storeUtils
 * @param {object} store - Svelte store
 * @param {string} key - Local storage key
 * @param {number} defaultValue - Default value for the store
 * @return {function} initStoreFromLocalStorage
 */
export function initStoreFromLocalStorage(store, key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  let parsedValue;
  if (storedValue !== null) {
    if (typeof defaultValue === 'boolean') {
      parsedValue = storedValue === 'true';
    } else if (typeof defaultValue === 'number') {
      parsedValue = parseFloat(storedValue);
    }
  } else {
    parsedValue = defaultValue;
  }

  store.set(parsedValue);

  return store.subscribe((value) => {
    localStorage.setItem(key, value.toString());
  });
}

/**
 * Setup store with local storage
 * @module utils/storeUtils
 * @param {object} store - Svelte store
 * @param {string} key - Local storage key
 * @param {number} defaultValue - Default value for the store
 * @return {function} unsubscribe
 */
export function setupStore(store, key, defaultValue) {
  const unsubscribe = initStoreFromLocalStorage(store, key, defaultValue);
  return unsubscribe;
}
