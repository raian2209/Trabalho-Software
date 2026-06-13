import { OrderStatus, Role } from "@/types/types";

/** Categorias disponíveis no cadastro/edição de produtos. */
export const CATEGORIAS_PRODUTO = [
  "Eletrônicos",
  "Moda",
  "Casa",
  "Beleza",
  "Alimentos",
] as const;

/** Opções do filtro de status de pedidos (value em minúsculo, como a API compara). */
export const FILTRO_STATUS_PEDIDO = [
  { value: "todos", label: "Todos Status" },
  { value: "pendente", label: "Pendente" },
  { value: "processando", label: "Processando" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
] as const;

/** Status que o fornecedor pode atribuir a uma venda (devem existir no enum do backend). */
export const STATUS_FORNECEDOR_OPCOES: OrderStatus[] = [
  "PROCESSANDO",
  "APROVADO",
  "ENVIADO",
  "ENTREGUE",
  "CONCLUIDO",
  "CANCELADO",
];

/** Rótulo amigável por role. */
export const ROLE_LABELS: Record<Role, string> = {
  ROLE_ADMIN: "Administrador",
  ROLE_FORNECEDOR: "Fornecedor",
  ROLE_USUARIO: "Cliente",
};

/** Status de pedido que ainda permitem cancelamento. */
export function isPedidoCancelavel(status: OrderStatus | string): boolean {
  const s = status?.toString().toUpperCase();
  return s === "PENDENTE" || s === "PROCESSANDO";
}

/** Classes Tailwind do badge de status de pedido. */
export function statusPedidoColor(status: OrderStatus | string): string {
  const s = status?.toString().toLowerCase();
  if (s === "pendente" || s === "processando")
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50";
  if (s === "aprovado" || s === "concluido")
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50";
  if (s === "enviado")
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50";
  if (s === "entregue")
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50";
  if (s === "cancelado")
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50";
  return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600";
}
