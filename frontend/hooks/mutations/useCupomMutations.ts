"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cuponsApi, CupomPayload } from "@/lib/api/cupons";
import { cupomKeys } from "../queries/useCupons";
import { useAuthToken } from "../useAuthToken";

export function useCreateCupom() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CupomPayload) => cuponsApi.create(payload, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: cupomKeys.all }),
  });
}

export function useUpdateCupom(id: string) {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CupomPayload) => cuponsApi.update(id, payload, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: cupomKeys.all }),
  });
}

export function useDeleteCupom() {
  const token = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cuponsApi.remove(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: cupomKeys.all }),
  });
}

/** Valida um código de cupom (usado no carrinho). */
export function useVerificarCupom() {
  const token = useAuthToken();
  return useMutation({
    mutationFn: (codigo: string) => cuponsApi.getByCodigo(codigo, token!),
  });
}
