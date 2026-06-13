import { Coupon } from "@/types/types";
import { apiFetch } from "./client";

export type CupomPayload = {
  codigo: string;
  tipoDesconto: string;
  valorDesconto: string | number;
  dataValidade: string;
};

export const cuponsApi = {
  list: (token: string) => apiFetch<Coupon[]>("/api/cupons", { token }),

  getByCodigo: (codigo: string, token: string) =>
    apiFetch<Coupon>(`/api/cupons/codigo/${codigo}`, { token }),

  create: (payload: CupomPayload, token: string) =>
    apiFetch<Coupon>("/api/cupons", { method: "POST", body: payload, token }),

  update: (id: string, payload: CupomPayload, token: string) =>
    apiFetch<Coupon>(`/api/cupons/${id}`, {
      method: "PUT",
      body: payload,
      token,
    }),

  remove: (id: string, token: string) =>
    apiFetch<void>(`/api/cupons/${id}`, { method: "DELETE", token }),
};
