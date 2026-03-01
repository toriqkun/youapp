// Horoscope (Western Zodiac signs) icon mapping
export const horoscopeIconMap: Record<string, string> = {
  Aries: '/icons/aries.svg',
  Taurus: '/icons/taurus.svg',
  Gemini: '/icons/gemini.svg',
  Cancer: '/icons/cancer.svg',
  Leo: '/icons/leo.svg',
  Virgo: '/icons/virgo.svg',
  Libra: '/icons/libra.svg',
  Scorpio: '/icons/scorpio.svg',
  Sagittarius: '/icons/sagittarius.svg',
  Capricorn: '/icons/capricorn.svg',
  Aquarius: '/icons/aquarius.svg',
  Pisces: '/icons/pisces.svg',
};

// Zodiac (Chinese Zodiac signs) icon mapping
export const zodiacIconMap: Record<string, string> = {
  Monkey: '/icons/monkey.svg',
  Rooster: '/icons/rooster.svg',
  Dog: '/icons/dog.svg',
  Pig: '/icons/pig.svg',
  Rat: '/icons/rat.svg',
  Ox: '/icons/ox.svg',
  Tiger: '/icons/tiger.svg',
  Rabbit: '/icons/rabbit.svg',
  Dragon: '/icons/dragon.svg',
  Snake: '/icons/snake.svg',
  Horse: '/icons/horse.svg',
  Goat: '/icons/goat.svg',
};

export const getHoroscopeIcon = (horoscope: string): string => {
  return horoscopeIconMap[horoscope] || '';
};

export const getZodiacIcon = (zodiac: string): string => {
  return zodiacIconMap[zodiac] || '';
};
