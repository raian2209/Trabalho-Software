import { apiFetch } from "./client";

export type DashboardResumo = {
  totalProdutos: number;
  totalVendas: number;
  faturamentoTotal: number;
};

export const dashboardApi = {
  resumo: (token: string) =>
    apiFetch<DashboardResumo>("/api/dashboard/resumo", { token }),
};
