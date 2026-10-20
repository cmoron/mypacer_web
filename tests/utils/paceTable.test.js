import {describe, it, expect} from 'vitest';
import {computePaceTable, round2, tableColumns} from '../../src/lib/utils/paceTable.js';
import {DEFAULT_DISTANCES} from '../../src/lib/utils/constants.js';

describe('computePaceTable', () => {
  it('reproduit le tableau de l API (bornes incluses, pas décroissant)', () => {
    const rows = computePaceTable(360, 120, 1, DEFAULT_DISTANCES);
    expect(rows).toHaveLength(241);
    expect(rows[0]).toMatchObject({pace: 360, speed: 10, 400: 144, 1609.34: 579.36, 42195: 15190.2});
    expect(rows[240].pace).toBe(120);
    expect(rows[4].speed).toBe(10.11);
  });

  it('respecte l incrément', () => {
    expect(computePaceTable(300, 240, 30, [1000]).map((r) => r.pace)).toEqual([300, 270, 240]);
  });
});

describe('tableColumns', () => {
  it('trie les distances numériquement, sans pace ni speed', () => {
    expect(tableColumns([{pace: 1, speed: 2, 10000: 3, 1609.34: 4, 400: 5}])).toEqual([400, 1609.34, 10000]);
    expect(tableColumns([])).toEqual([]);
  });
});

describe('round2', () => {
  it('arrondit comme Python round(x, 2)', () => {
    expect(round2(15148.004999999999)).toBe(15148); // 42.195 * 359
    expect(round2(24262.125)).toBe(24262.12); // égalité : chiffre pair
    expect(round2(20042.625)).toBe(20042.62);
    expect(round2(0.135)).toBe(0.14); // 0.135 n'est pas exact en binaire
    expect(round2(1.375)).toBe(1.38); // égalité : chiffre pair supérieur
  });
});
