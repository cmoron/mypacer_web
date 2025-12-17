import {describe, it, expect, beforeEach} from 'vitest';
import {get} from 'svelte/store';
import {showWorldRecords, worldRecords, isLoadingRecords} from '../../src/worldRecords/worldRecordsStore.js';

describe('worldRecordsStore', () => {
  describe('showWorldRecords', () => {
    it('should have default value of false', () => {
      expect(get(showWorldRecords)).toBe(false);
    });

    it('should update value when set', () => {
      showWorldRecords.set(true);
      expect(get(showWorldRecords)).toBe(true);

      showWorldRecords.set(false);
      expect(get(showWorldRecords)).toBe(false);
    });
  });

  describe('worldRecords', () => {
    it('should have default empty structure', () => {
      const records = get(worldRecords);
      expect(records).toEqual({men: {}, women: {}});
    });

    it('should update with new records', () => {
      const newRecords = {
        men: {100: 9.58, 200: 19.19},
        women: {100: 10.49, 200: 21.34},
      };
      worldRecords.set(newRecords);
      expect(get(worldRecords)).toEqual(newRecords);
    });

    it('should update partial records', () => {
      worldRecords.update((r) => ({
        ...r,
        men: {1500: 206.0},
      }));
      const records = get(worldRecords);
      expect(records.men).toEqual({1500: 206.0});
    });
  });

  describe('isLoadingRecords', () => {
    beforeEach(() => {
      isLoadingRecords.set(false);
    });

    it('should have default value of false', () => {
      expect(get(isLoadingRecords)).toBe(false);
    });

    it('should update loading state', () => {
      isLoadingRecords.set(true);
      expect(get(isLoadingRecords)).toBe(true);

      isLoadingRecords.set(false);
      expect(get(isLoadingRecords)).toBe(false);
    });
  });
});
