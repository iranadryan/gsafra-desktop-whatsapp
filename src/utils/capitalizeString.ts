export function capitalizeString(string: string) {
  return string.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
