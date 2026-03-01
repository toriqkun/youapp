export type HoroscopeType =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const getHoroscope = (day: number, month: number): HoroscopeType | '' => {
  if (!day || !month || day < 1 || month < 1 || month > 12) return '';
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  
  return '';
};

export const calculateHoroscopeFromBirthday = (birthday: string): HoroscopeType | '' => {
  if (!birthday) return '';
  // Handles DD MM YYYY, DD-MM-YYYY, or YYYY-MM-DD
  const parts = birthday.split(/[\s-]/);
  if (parts.length === 3) {
    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    
    // If first part is a year (e.g. 1995-12-05)
    if (parts[0].length === 4) {
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    }
    
    if (!isNaN(day) && !isNaN(month)) {
      return getHoroscope(day, month);
    }
  }
  return '';
};
