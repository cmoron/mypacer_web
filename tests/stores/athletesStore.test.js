import {describe, it, expect, beforeEach} from 'vitest';
import {get} from 'svelte/store';
import {selectedAthletes} from '../../src/lib/stores/athletesStore.js';

describe('athletesStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store
    localStorage.clear();
    selectedAthletes.reset();
  });

  describe('initialization', () => {
    it('should start with empty array', () => {
      expect(get(selectedAthletes)).toEqual([]);
    });
  });

  describe('addAthlete', () => {
    it('should add athlete with default properties', () => {
      const athlete = {id: 'athlete1', name: 'John Doe'};
      selectedAthletes.addAthlete(athlete);

      const athletes = get(selectedAthletes);
      expect(athletes).toHaveLength(1);
      expect(athletes[0]).toMatchObject({
        id: 'athlete1',
        name: 'John Doe',
        isLoading: false,
        visible: true,
        records: [],
      });
      expect(athletes[0].color).toBeDefined();
    });

    it('should assign different colors to different athletes', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      const athletes = get(selectedAthletes);
      expect(athletes[0].color).not.toBe(athletes[1].color);
    });

    it('should not add duplicate athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});

      expect(get(selectedAthletes)).toHaveLength(1);
    });

    it('should assign colors from color pool', () => {
      const athlete = {id: 'athlete1', name: 'John'};
      selectedAthletes.addAthlete(athlete);

      const athletes = get(selectedAthletes);
      expect(athletes[0].color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should recycle colors when pool is exhausted', () => {
      // Add 11 athletes (more than 10 color pool size)
      for (let i = 0; i < 11; i++) {
        selectedAthletes.addAthlete({id: `athlete${i}`, name: `Athlete ${i}`});
      }

      const athletes = get(selectedAthletes);
      expect(athletes).toHaveLength(11);
      // First and 11th athlete should have the same color (recycled)
      expect(athletes[0].color).toBe(athletes[10].color);
    });
  });

  describe('removeAthlete', () => {
    it('should remove athlete by id', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      selectedAthletes.removeAthlete('athlete1');

      const athletes = get(selectedAthletes);
      expect(athletes).toHaveLength(1);
      expect(athletes[0].id).toBe('athlete2');
    });

    it('should release color back to pool when removing athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      const color1 = get(selectedAthletes)[0].color;

      selectedAthletes.removeAthlete('athlete1');
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      const color2 = get(selectedAthletes)[0].color;
      expect(color2).toBe(color1); // Color should be reused
    });

    it('should handle removing non-existent athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      expect(() => selectedAthletes.removeAthlete('nonexistent')).not.toThrow();
      expect(get(selectedAthletes)).toHaveLength(1);
    });
  });

  describe('setLoading', () => {
    it('should update loading state for specific athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.setLoading('athlete1', true);

      const athletes = get(selectedAthletes);
      expect(athletes[0].isLoading).toBe(true);
    });

    it('should not affect other athletes', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      selectedAthletes.setLoading('athlete1', true);

      const athletes = get(selectedAthletes);
      expect(athletes[0].isLoading).toBe(true);
      expect(athletes[1].isLoading).toBe(false);
    });
  });

  describe('setRecords', () => {
    it('should update records for specific athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      const records = [{distance: 100, time: 10.5}];

      selectedAthletes.setRecords('athlete1', records);

      const athletes = get(selectedAthletes);
      expect(athletes[0].records).toEqual(records);
      expect(athletes[0].isLoading).toBe(false);
    });

    it('should set isLoading to false when setting records', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.setLoading('athlete1', true);

      selectedAthletes.setRecords('athlete1', [{distance: 100, time: 10.5}]);

      const athletes = get(selectedAthletes);
      expect(athletes[0].isLoading).toBe(false);
    });
  });

  describe('setAllInvisible', () => {
    it('should set all athletes to invisible', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      selectedAthletes.setAllInvisible();

      const athletes = get(selectedAthletes);
      expect(athletes[0].visible).toBe(false);
      expect(athletes[1].visible).toBe(false);
    });
  });

  describe('toggleVisible', () => {
    it('should toggle visibility of specific athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});

      selectedAthletes.toggleVisible('athlete1');
      expect(get(selectedAthletes)[0].visible).toBe(false);

      selectedAthletes.toggleVisible('athlete1');
      expect(get(selectedAthletes)[0].visible).toBe(true);
    });

    it('should not affect other athletes', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      selectedAthletes.toggleVisible('athlete1');

      const athletes = get(selectedAthletes);
      expect(athletes[0].visible).toBe(false);
      expect(athletes[1].visible).toBe(true);
    });
  });

  describe('isAthleteVisible', () => {
    it('should return visibility status of athlete', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});

      expect(selectedAthletes.isAthleteVisible('athlete1')).toBe(true);

      selectedAthletes.toggleVisible('athlete1');
      expect(selectedAthletes.isAthleteVisible('athlete1')).toBe(false);
    });

    it('should return false for non-existent athlete', () => {
      expect(selectedAthletes.isAthleteVisible('nonexistent')).toBe(false);
    });
  });

  describe('reset', () => {
    it('should clear all athletes', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      selectedAthletes.reset();

      expect(get(selectedAthletes)).toEqual([]);
    });

    it('should reset color pool', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});
      const color1 = get(selectedAthletes)[0].color;

      selectedAthletes.reset();
      selectedAthletes.addAthlete({id: 'athlete2', name: 'Jane'});

      const color2 = get(selectedAthletes)[0].color;
      expect(color2).toBe(color1); // Should get first color again
    });
  });

  describe('setAthletes', () => {
    it('should set athletes directly', () => {
      const athletes = [
        {id: 'athlete1', name: 'John', color: '#FF0000'},
        {id: 'athlete2', name: 'Jane', color: '#00FF00'},
      ];

      selectedAthletes.setAthletes(athletes);

      expect(get(selectedAthletes)).toEqual(athletes);
    });

    it('should replace existing athletes', () => {
      selectedAthletes.addAthlete({id: 'athlete1', name: 'John'});

      const newAthletes = [{id: 'athlete2', name: 'Jane', color: '#00FF00'}];
      selectedAthletes.setAthletes(newAthletes);

      expect(get(selectedAthletes)).toHaveLength(1);
      expect(get(selectedAthletes)[0].id).toBe('athlete2');
    });
  });
});
