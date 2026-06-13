/** Formata um valor numérico como moeda angolana (Kz). */
export function formatCurrency(value: number | null | undefined): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(value || 0);
}

/** Formata uma data ISO/string para o formato pt-BR (dd/mm/aaaa). */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "N/A";
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}
