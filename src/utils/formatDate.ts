export function concatDateTimeToDate(date: string, time: string): Date {
  if (!date || !time) return new Date();
  // Garante que a hora tenha segundos
  const timeWithSeconds = time.length === 5 ? `${time}:00` : time;
  // Monta string no padrão ISO
  const isoString = `${date}T${timeWithSeconds}`;
  return new Date(isoString);
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year} - ${date.getHours()}:${date.getMinutes()}`;
}
