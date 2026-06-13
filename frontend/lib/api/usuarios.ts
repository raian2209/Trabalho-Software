import { User } from "@/types/types";
import { apiFetch } from "./client";

export type PerfilPayload = {
  nome: string;
  email: string;
  senha: string;
};

export const usuariosApi = {
  /** Lista todos os usuários (admin). */
  list: (token: string) => apiFetch<User[]>("/api/users", { token }),

  updatePerfil: (payload: PerfilPayload, token: string) =>
    apiFetch<void>("/api/users", { method: "PUT", body: payload, token }),

  deleteConta: (token: string) =>
    apiFetch<void>("/api/users", { method: "DELETE", token }),
};
