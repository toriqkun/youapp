import { calculateZodiac } from './utils/zodiac.util';
import { calculateHoroscope } from './utils/horoscope.util';

describe('Utils', () => {
  describe('calculateZodiac', () => {
    it('should calculate correct zodiac for Capricorn (Jan 15)', () => {
      const birthday = new Date('2000-01-15');
      expect(calculateZodiac(birthday)).toBe('Capricorn');
    });

    it('should calculate correct zodiac for Aries (March 25)', () => {
      const birthday = new Date('2000-03-25');
      expect(calculateZodiac(birthday)).toBe('Aries');
    });

    it('should calculate correct zodiac for Scorpio (Nov 10)', () => {
      const birthday = new Date('2000-11-10');
      expect(calculateZodiac(birthday)).toBe('Scorpio');
    });
  });

  describe('calculateHoroscope', () => {
    it('should calculate correct horoscope for 2000 (Dragon)', () => {
      const birthday = new Date('2000-01-15');
      expect(calculateHoroscope(birthday)).toBe('Dragon');
    });

    it('should calculate correct horoscope for 1990 (Horse)', () => {
      const birthday = new Date('1990-05-15');
      expect(calculateHoroscope(birthday)).toBe('Horse');
    });

    it('should calculate correct horoscope for 1995 (Pig)', () => {
      const birthday = new Date('1995-10-10');
      expect(calculateHoroscope(birthday)).toBe('Pig');
    });
  });
});
