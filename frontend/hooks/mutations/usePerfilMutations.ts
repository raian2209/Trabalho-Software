"use client";

import { useMutation } from "@tanstack/react-query";
import { usuariosApi, PerfilPayload } from "@/lib/api/usuarios";
import { useAuthToken } from "../useAuthToken";

export function useUpdatePerfil() {
  const token = useAuthToken();
  return useMutation({
    mutationFn: (payload: PerfilPayload) =>
      usuariosApi.updatePerfil(payload, token!),
  });
}

export function useDeleteConta() {
  const token = useAuthToken();
  return useMutation({
    mutationFn: () => usuariosApi.deleteConta(token!),
  });
}
