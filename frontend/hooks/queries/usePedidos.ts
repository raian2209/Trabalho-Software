"use client";

import { useQuery } from "@tanstack/react-query";
import { pedidosApi } from "@/lib/api/pedidos";
import { useAuthToken } from "../useAuthToken";

export const pedidoKeys = {
  cliente: ["pedidos", "cliente"] as const,
  vendas: ["pedidos", "vendas"] as const,
};

/** Pedidos do cliente, ordenados do mais recente para o mais antigo. */
export function usePedidos() {
  const token = useAuthToken();
  return useQuery({
    queryKey: pedidoKeys.cliente,
    queryFn: async () => {
      const data = await pedidosApi.list(token!);
      return Array.isArray(data)
        ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
        : [];
    },
    enabled: !!token,
  });
}

/** Vendas recebidas pelo fornecedor. */
export function useVendas() {
  const token = useAuthToken();
  return useQuery({
    queryKey: pedidoKeys.vendas,
    queryFn: async () => {
      const data = await pedidosApi.listVendas(token!);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });
}
