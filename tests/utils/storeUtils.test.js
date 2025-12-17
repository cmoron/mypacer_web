import {describe, it, expect, beforeEach} from 'vitest';
import {writable, get} from 'svelte/store';
import {initStoreFromLocalStorage, setupStore} from '../../src/utils/storeUtils.js';

describe('storeUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initStoreFromLocalStorage', () => {
    describe('with number default value', () => {
      it('should initialize with default value when localStorage is empty', () => {
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 42);

        expect(get(store)).toBe(42);
      });

      it('should restore number from localStorage', () => {
        localStorage.setItem('testKey', '100');
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 42);

        expect(get(store)).toBe(100);
      });

      it('should handle float values', () => {
        localStorage.setItem('testKey', '16.5');
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 16);

        expect(get(store)).toBe(16.5);
      });

      it('should persist changes to localStorage', () => {
        const store = writable(0);
        const unsubscribe = initStoreFromLocalStorage(store, 'testKey', 42);

        store.set(100);

        expect(localStorage.getItem('testKey')).toBe('100');
        unsubscribe();
      });

      it('should handle multiple updates', () => {
        const store = writable(0);
        const unsubscribe = initStoreFromLocalStorage(store, 'testKey', 42);

        store.set(100);
        expect(localStorage.getItem('testKey')).toBe('100');

        store.set(200);
        expect(localStorage.getItem('testKey')).toBe('200');

        unsubscribe();
      });
    });

    describe('with boolean default value', () => {
      it('should initialize with default boolean value', () => {
        const store = writable(false);
        initStoreFromLocalStorage(store, 'testBool', true);

        expect(get(store)).toBe(true);
      });

      it('should restore true from localStorage', () => {
        localStorage.setItem('testBool', 'true');
        const store = writable(false);
        initStoreFromLocalStorage(store, 'testBool', false);

        expect(get(store)).toBe(true);
      });

      it('should restore false from localStorage', () => {
        localStorage.setItem('testBool', 'false');
        const store = writable(true);
        initStoreFromLocalStorage(store, 'testBool', true);

        expect(get(store)).toBe(false);
      });

      it('should persist boolean changes to localStorage', () => {
        const store = writable(false);
        const unsubscribe = initStoreFromLocalStorage(store, 'testBool', false);

        store.set(true);
        expect(localStorage.getItem('testBool')).toBe('true');

        store.set(false);
        expect(localStorage.getItem('testBool')).toBe('false');

        unsubscribe();
      });
    });

    describe('subscription cleanup', () => {
      it('should return unsubscribe function', () => {
        const store = writable(0);
        const unsubscribe = initStoreFromLocalStorage(store, 'testKey', 42);

        expect(typeof unsubscribe).toBe('function');
        expect(() => unsubscribe()).not.toThrow();
      });

      it('should stop persisting after unsubscribe', () => {
        const store = writable(0);
        const unsubscribe = initStoreFromLocalStorage(store, 'testKey', 42);

        store.set(100);
        expect(localStorage.getItem('testKey')).toBe('100');

        unsubscribe();

        // Clear localStorage to verify no new writes
        localStorage.removeItem('testKey');
        store.set(200);

        // Should not have been written to localStorage
        expect(localStorage.getItem('testKey')).toBeNull();
      });
    });

    describe('edge cases', () => {
      it('should handle null localStorage value', () => {
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 42);

        expect(get(store)).toBe(42);
      });

      it('should handle invalid number in localStorage', () => {
        localStorage.setItem('testKey', 'invalid');
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 42);

        // parseFloat('invalid') returns NaN
        expect(get(store)).toBeNaN();
      });

      it('should handle empty string in localStorage', () => {
        localStorage.setItem('testKey', '');
        const store = writable(0);
        initStoreFromLocalStorage(store, 'testKey', 42);

        // parseFloat('') returns NaN
        expect(get(store)).toBeNaN();
      });

      it('should handle zero value', () => {
        localStorage.setItem('testKey', '0');
        const store = writable(100);
        initStoreFromLocalStorage(store, 'testKey', 42);

        expect(get(store)).toBe(0);
      });
    });
  });

  describe('setupStore', () => {
    it('should be an alias for initStoreFromLocalStorage', () => {
      const store = writable(0);
      const unsubscribe = setupStore(store, 'testKey', 42);

      expect(get(store)).toBe(42);
      expect(typeof unsubscribe).toBe('function');

      store.set(100);
      expect(localStorage.getItem('testKey')).toBe('100');

      unsubscribe();
    });

    it('should work with boolean values', () => {
      const store = writable(false);
      const unsubscribe = setupStore(store, 'testBool', true);

      expect(get(store)).toBe(true);

      unsubscribe();
    });

    it('should restore from localStorage', () => {
      localStorage.setItem('testKey', '99');
      const store = writable(0);
      const unsubscribe = setupStore(store, 'testKey', 42);

      expect(get(store)).toBe(99);

      unsubscribe();
    });
  });
});
