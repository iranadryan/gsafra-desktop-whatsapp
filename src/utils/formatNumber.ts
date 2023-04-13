export function formatNumber(number: number, suffix?: string) {
  return `${Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2
  }).format(number)}${suffix || ''}`;
}
