import { Order } from "@/types/types";
import { apiFetch } from "./client";

export type PedidoPayload = {
  itens: { produtoId: string; quantidade: number }[];
  codigoCupom: string | null;
  totalPago: number;
};

export const pedidosApi = {
  /** Pedidos do cliente autenticado. */
  list: (token: string) => apiFetch<Order[]>("/api/pedidos", { token }),

  /** Vendas recebidas pelo fornecedor autenticado. */
  listVendas: (token: string) =>
    apiFetch<Order[]>("/api/pedidos/vendas", { token }),

  create: (payload: PedidoPayload, token: string) =>
    apiFetch<Order>("/api/pedidos", { method: "POST", body: payload, token }),

  /** Cancela um pedido (a API usa POST em /api/pedidos/:id). */
  cancel: (id: string, token: string) =>
    apiFetch<void>(`/api/pedidos/${id}`, { method: "POST", token }),
};
