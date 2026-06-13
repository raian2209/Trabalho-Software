"use client";

import { useQuery } from "@tanstack/react-query";
import { usuariosApi } from "@/lib/api/usuarios";
import { useAuthToken } from "../useAuthToken";

export const usuarioKeys = {
  all: ["usuarios"] as const,
};

/** Lista de usuários (admin). */
export function useUsuarios() {
  const token = useAuthToken();
  return useQuery({
    queryKey: usuarioKeys.all,
    queryFn: () => usuariosApi.list(token!),
    enabled: !!token,
  });
}
