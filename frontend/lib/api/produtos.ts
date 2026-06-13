import { Product } from "@/types/types";
import { apiFetch } from "./client";

export type ProdutoPayload = {
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
};

export const produtosApi = {
  /** Catálogo público (todos os produtos). */
  list: (token?: string | null) =>
    apiFetch<Product[]>("/api/produtos", { token }),

  /** Produtos do fornecedor autenticado. */
  listVendedor: (token: string) =>
    apiFetch<Product[]>("/api/produtos/produtos-vendedor", { token }),

  get: (id: string, token?: string | null) =>
    apiFetch<Product>(`/api/produtos/${id}`, { token }),

  create: (payload: ProdutoPayload, token: string) =>
    apiFetch<Product>("/api/produtos", { method: "POST", body: payload, token }),

  update: (id: string, payload: ProdutoPayload, token: string) =>
    apiFetch<Product>(`/api/produtos/${id}`, {
      method: "PUT",
      body: payload,
      token,
    }),

  remove: (id: string, token: string) =>
    apiFetch<void>(`/api/produtos/${id}`, { method: "DELETE", token }),
};
