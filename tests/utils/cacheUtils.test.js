import {describe, it, expect, beforeEach, vi} from 'vitest';
import {getFromCache, setInCache, removeFromCache, getAthleteRecordsCacheKey} from '../../src/lib/utils/cacheUtils.js';

describe('cacheUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  describe('getAthleteRecordsCacheKey', () => {
    it('should generate correct cache key for athlete ID', () => {
      expect(getAthleteRecordsCacheKey('529223')).toBe('athlete_records_529223');
    });

    it('should handle different athlete IDs', () => {
      expect(getAthleteRecordsCacheKey('123456')).toBe('athlete_records_123456');
      expect(getAthleteRecordsCacheKey('abc')).toBe('athlete_records_abc');
    });
  });

  describe('setInCache', () => {
    it('should store data in localStorage', () => {
      const data = {records: {5000: 900}};
      setInCache('test_key', data);

      const stored = JSON.parse(localStorage.getItem('test_key'));
      expect(stored.data).toEqual(data);
    });

    it('should store cachedAt timestamp', () => {
      const now = Date.now();
      setInCache('test_key', {foo: 'bar'});

      const stored = JSON.parse(localStorage.getItem('test_key'));
      expect(stored.cachedAt).toBe(now);
    });

    it('should store expiresAt with default TTL of 24h', () => {
      const now = Date.now();
      const expectedExpiry = now + 24 * 60 * 60 * 1000;
      setInCache('test_key', {foo: 'bar'});

      const stored = JSON.parse(localStorage.getItem('test_key'));
      expect(stored.expiresAt).toBe(expectedExpiry);
    });

    it('should store expiresAt with custom TTL', () => {
      const now = Date.now();
      const customTTL = 60 * 60 * 1000; // 1 heure
      setInCache('test_key', {foo: 'bar'}, customTTL);

      const stored = JSON.parse(localStorage.getItem('test_key'));
      expect(stored.expiresAt).toBe(now + customTTL);
    });
  });

  describe('getFromCache', () => {
    it('should return null for non-existent key', () => {
      expect(getFromCache('non_existent')).toBeNull();
    });

    it('should return cached data if not expired', () => {
      const data = {records: {5000: 900, 10000: 1900}};
      setInCache('test_key', data);

      expect(getFromCache('test_key')).toEqual(data);
    });

    it('should return null and remove expired cache', () => {
      const data = {records: {5000: 900}};
      setInCache('test_key', data, 1000); // TTL de 1 seconde

      // Avancer le temps de 2 secondes
      vi.advanceTimersByTime(2000);

      expect(getFromCache('test_key')).toBeNull();
      expect(localStorage.getItem('test_key')).toBeNull();
    });

    it('should return data just before expiry', () => {
      const data = {records: {5000: 900}};
      setInCache('test_key', data, 10000); // TTL de 10 secondes

      // Avancer le temps de 9 secondes (juste avant expiration)
      vi.advanceTimersByTime(9000);

      expect(getFromCache('test_key')).toEqual(data);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('test_key', 'invalid json');

      expect(getFromCache('test_key')).toBeNull();
    });
  });

  describe('removeFromCache', () => {
    it('should remove entry from localStorage', () => {
      setInCache('test_key', {foo: 'bar'});
      expect(localStorage.getItem('test_key')).not.toBeNull();

      removeFromCache('test_key');
      expect(localStorage.getItem('test_key')).toBeNull();
    });

    it('should not throw for non-existent key', () => {
      expect(() => removeFromCache('non_existent')).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should cache and retrieve athlete records', () => {
      const athleteId = '529223';
      const records = {
        5000: 850,
        10000: 1750,
        21097: 3900,
      };

      const cacheKey = getAthleteRecordsCacheKey(athleteId);
      setInCache(cacheKey, records);

      const retrieved = getFromCache(cacheKey);
      expect(retrieved).toEqual(records);
    });

    it('should expire athlete records after TTL', () => {
      const athleteId = '529223';
      const records = {5000: 850};
      const ttl = 24 * 60 * 60 * 1000; // 24h

      const cacheKey = getAthleteRecordsCacheKey(athleteId);
      setInCache(cacheKey, records, ttl);

      // Avancer de 25 heures
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      expect(getFromCache(cacheKey)).toBeNull();
    });
  });
});
