"use client";

import { useQuery } from "@tanstack/react-query";
import { produtosApi } from "@/lib/api/produtos";
import { useAuthToken } from "../useAuthToken";

export const produtoKeys = {
  all: ["produtos"] as const,
  vendedor: ["produtos", "vendedor"] as const,
  detail: (id: string) => ["produtos", id] as const,
};

/** Catálogo público de produtos. */
export function useProdutos() {
  const token = useAuthToken();
  return useQuery({
    queryKey: produtoKeys.all,
    queryFn: () => produtosApi.list(token),
  });
}

/** Produtos do fornecedor autenticado. */
export function useProdutosVendedor() {
  const token = useAuthToken();
  return useQuery({
    queryKey: produtoKeys.vendedor,
    queryFn: () => produtosApi.listVendedor(token!),
    enabled: !!token,
  });
}

/** Detalhe de um produto (para edição). */
export function useProduto(id: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: produtoKeys.detail(id),
    queryFn: () => produtosApi.get(id, token),
    enabled: !!id && !!token,
  });
}
