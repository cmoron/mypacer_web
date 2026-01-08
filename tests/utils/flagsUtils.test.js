import {describe, it, expect} from 'vitest';
import {flagIso3ToIso2} from '../../src/lib/utils/flagsUtils.js';

describe('flagsUtils', () => {
  describe('flagIso3ToIso2', () => {
    it('should convert common ISO3 country codes to ISO2', () => {
      expect(flagIso3ToIso2('FRA')).toBe('FR');
      expect(flagIso3ToIso2('USA')).toBe('US');
      expect(flagIso3ToIso2('GBR')).toBe('GB');
      expect(flagIso3ToIso2('DEU')).toBe('DE');
      expect(flagIso3ToIso2('ESP')).toBe('ES');
      expect(flagIso3ToIso2('ITA')).toBe('IT');
    });

    it('should handle African countries', () => {
      expect(flagIso3ToIso2('KEN')).toBe('KE');
      expect(flagIso3ToIso2('ETH')).toBe('ET');
      expect(flagIso3ToIso2('ZAF')).toBe('ZA');
      expect(flagIso3ToIso2('EGY')).toBe('EG');
    });

    it('should handle Asian countries', () => {
      expect(flagIso3ToIso2('CHN')).toBe('CN');
      expect(flagIso3ToIso2('JPN')).toBe('JP');
      expect(flagIso3ToIso2('IND')).toBe('IN');
      expect(flagIso3ToIso2('KOR')).toBe('KR');
    });

    it('should handle small territories and islands', () => {
      expect(flagIso3ToIso2('ALA')).toBe('AX');
      expect(flagIso3ToIso2('BMU')).toBe('BM');
      expect(flagIso3ToIso2('GIB')).toBe('GI');
      expect(flagIso3ToIso2('MCO')).toBe('MC');
    });

    it('should return "xx" for unknown country codes', () => {
      expect(flagIso3ToIso2('ZZZ')).toBe('xx');
      expect(flagIso3ToIso2('AAA')).toBe('xx');
      expect(flagIso3ToIso2('XYZ')).toBe('xx');
    });

    it('should return "xx" for empty or invalid input', () => {
      expect(flagIso3ToIso2('')).toBe('xx');
      expect(flagIso3ToIso2('AB')).toBe('xx');
      expect(flagIso3ToIso2('ABCD')).toBe('xx');
    });

    it('should handle special territories', () => {
      expect(flagIso3ToIso2('HKG')).toBe('HK');
      expect(flagIso3ToIso2('MAC')).toBe('MO');
      expect(flagIso3ToIso2('TWN')).toBe('TW');
      expect(flagIso3ToIso2('PSE')).toBe('PS');
    });

    it('should handle all Nordic countries', () => {
      expect(flagIso3ToIso2('NOR')).toBe('NO');
      expect(flagIso3ToIso2('SWE')).toBe('SE');
      expect(flagIso3ToIso2('FIN')).toBe('FI');
      expect(flagIso3ToIso2('DNK')).toBe('DK');
      expect(flagIso3ToIso2('ISL')).toBe('IS');
    });

    it('should handle Latin American countries', () => {
      expect(flagIso3ToIso2('BRA')).toBe('BR');
      expect(flagIso3ToIso2('ARG')).toBe('AR');
      expect(flagIso3ToIso2('MEX')).toBe('MX');
      expect(flagIso3ToIso2('CHL')).toBe('CL');
      expect(flagIso3ToIso2('COL')).toBe('CO');
    });

    it('should handle Caribbean nations', () => {
      expect(flagIso3ToIso2('JAM')).toBe('JM');
      expect(flagIso3ToIso2('CUB')).toBe('CU');
      expect(flagIso3ToIso2('HTI')).toBe('HT');
      expect(flagIso3ToIso2('DOM')).toBe('DO');
    });
  });
});
