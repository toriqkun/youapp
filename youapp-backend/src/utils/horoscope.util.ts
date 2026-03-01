/**
 * Calculate Chinese Horoscope (Shio) from birth year.
 * Horoscope dihitung dari tahun lahir.
 * Tidak boleh diinput manual — derived field.
 */
export function calculateHoroscope(birthday: Date): string {
  const date = new Date(birthday);
  const year = date.getFullYear();

  const animals = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ];

  // The Chinese zodiac cycle starts from the year 4 CE (Rat year)
  const index = (year - 4) % 12;
  const normalizedIndex = index < 0 ? index + 12 : index;

  return animals[normalizedIndex];
}
