export const calculateAge = (birthday: string): number | null => {
  if (!birthday) return null;
  const parts = birthday.split(/[\s-]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const today = new Date();
      let age = today.getFullYear() - year;
      const m = (today.getMonth() + 1) - month;
      if (m < 0 || (m === 0 && today.getDate() < day)) {
        age--;
      }
      return age;
    }
  }
  return null;
};
