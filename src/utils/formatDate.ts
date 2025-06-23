export function concatDateTimeToDate(date: string, time: string): Date {
  // Garante que a hora tenha segundos
  const timeWithSeconds = time.length === 5 ? `${time}:00` : time;
  // Monta string no padrão ISO
  const isoString = `${date}T${timeWithSeconds}`;
  return new Date(isoString);
}
