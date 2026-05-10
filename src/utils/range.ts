export function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
