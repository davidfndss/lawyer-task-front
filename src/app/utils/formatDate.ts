export function formatToDayMonth(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // mês é zero-indexado
  return `${day}/${month}`;
}

export function formatToDayMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // mês é zero-indexado
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
