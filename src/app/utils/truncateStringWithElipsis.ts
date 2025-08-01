export default function truncateStringWithEllipsis(
  str: string,
  maxLength: number,
  ellipsis: string = "..."
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}