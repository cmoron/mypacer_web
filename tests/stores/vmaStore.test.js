import {describe, it, expect} from 'vitest';
import {get} from 'svelte/store';
import {showVMA, selectedVMA} from '../../src/lib/stores/vmaStore.js';
import {DEFAULT_VMA} from '../../src/lib/utils/constants.js';

describe('vmaStore', () => {
  describe('showVMA', () => {
    it('should have default value of false', () => {
      expect(get(showVMA)).toBe(false);
    });

    it('should update value when set', () => {
      showVMA.set(true);
      expect(get(showVMA)).toBe(true);

      showVMA.set(false);
      expect(get(showVMA)).toBe(false);
    });

    it('should toggle value with update', () => {
      const initial = get(showVMA);
      showVMA.update((v) => !v);
      expect(get(showVMA)).toBe(!initial);
    });
  });

  describe('selectedVMA', () => {
    it('should have default value from constants', () => {
      expect(get(selectedVMA)).toBe(DEFAULT_VMA);
      expect(get(selectedVMA)).toBe(16);
    });

    it('should update value when set', () => {
      selectedVMA.set(18);
      expect(get(selectedVMA)).toBe(18);

      selectedVMA.set(14);
      expect(get(selectedVMA)).toBe(14);
    });

    it('should update value with update function', () => {
      selectedVMA.set(16);
      selectedVMA.update((v) => v + 2);
      expect(get(selectedVMA)).toBe(18);
    });

    it('should handle decimal values', () => {
      selectedVMA.set(16.5);
      expect(get(selectedVMA)).toBe(16.5);
    });
  });
});
