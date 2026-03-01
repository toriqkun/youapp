export type ZodiacType =
  | 'Monkey' | 'Rooster' | 'Dog' | 'Pig' | 'Rat' | 'Ox'
  | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Goat';

export const getZodiac = (year: number): ZodiacType | '' => {
  if (!year) return '';
  const zodiacs: ZodiacType[] = [
    'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox',
    'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'
  ];
  return zodiacs[year % 12];
};

export const calculateZodiacFromBirthday = (birthday: string): ZodiacType | '' => {
  if (!birthday) return '';
  const parts = birthday.split(/[\s-]/);
  if (parts.length === 3) {
    let year = parseInt(parts[2]);
    // If first part is a year
    if (parts[0].length === 4) {
      year = parseInt(parts[0]);
    }
    
    if (!isNaN(year)) {
      return getZodiac(year);
    }
  }
  return '';
};
