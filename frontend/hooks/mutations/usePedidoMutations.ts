"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidosApi, PedidoPayload } from "@/lib/api/pedidos";
import { OrderStatus } from "@/types/types";
import { pedidoKeys } from "../queries/usePedidos";
import { useAuthToken } from "../useAuthToken";

export function useCreatePedido() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PedidoPayload) => pedidosApi.create(payload, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: pedidoKeys.cliente }),
  });
}

export function useCancelPedido() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pedidosApi.cancel(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: pedidoKeys.cliente }),
  });
}

/** Fornecedor altera o status de uma venda. */
export function useUpdateStatusVenda() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      pedidosApi.updateStatus(id, status, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: pedidoKeys.vendas }),
  });
}
