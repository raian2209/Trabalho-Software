"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produtosApi, ProdutoPayload } from "@/lib/api/produtos";
import { produtoKeys } from "../queries/useProdutos";
import { useAuthToken } from "../useAuthToken";

export function useCreateProduto() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProdutoPayload) => produtosApi.create(payload, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: produtoKeys.vendedor }),
  });
}

export function useUpdateProduto(id: string) {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProdutoPayload) =>
      produtosApi.update(id, payload, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: produtoKeys.vendedor });
      qc.invalidateQueries({ queryKey: produtoKeys.detail(id) });
    },
  });
}

export function useDeleteProduto() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => produtosApi.remove(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: produtoKeys.vendedor }),
  });
}
